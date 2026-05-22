const axios = require("axios");
const db = require("./database");
const fs = require("fs");
const csv = require("csv-parser");

// limpa máscara do CNPJ
function limparCNPJ(cnpj) {
  return String(cnpj).replace(/\D/g, "");
}

// consulta API
async function consultarCNPJ(cnpj) {
  try {
    const clean = limparCNPJ(cnpj);

    const response = await axios.get(
      `https://brasilapi.com.br/api/cnpj/v1/${clean}`
    );

    return response.data;
  } catch (err) {
    console.error(`❌ API falhou para ${cnpj}:`, err.response?.status || err.message);
    return null;
  }
}

// salva no banco
function salvarEmpresa(empresa) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT OR IGNORE INTO empresas (
        cnpj, nome, fantasia, telefone, email,
        instagram, facebook, linkedin, website,
        situacao, municipio, uf
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
      empresa.cnpj,
      empresa.nome,
      empresa.fantasia,
      empresa.telefone,
      empresa.email,
      null,
      null,
      null,
      null,
      empresa.situacao,
      empresa.municipio,
      empresa.uf
    ];

    db.run(sql, valores, (err) => {
      if (err) {
        console.error("Erro ao salvar:", err.message);
        reject(err);
      } else {
        console.log(`✅ ${empresa.nome} (${empresa.cnpj})`);
        resolve();
      }
    });
  });
}

// verifica se já existe
function empresaExiste(cnpj) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT cnpj FROM empresas WHERE cnpj = ?",
      [cnpj],
      (err, row) => {
        if (err) reject(err);
        else resolve(!!row);
      }
    );
  });
}

// função principal
async function processarCSV() {
  return new Promise((resolve, reject) => {

    const lista = new Set(); // ✅ evita duplicados automaticamente

    if (!fs.existsSync("cnpjs.csv")) {
      console.log("⚠ Arquivo cnpjs.csv não encontrado");
      return resolve();
    }

    fs.createReadStream("cnpjs.csv")
      .pipe(csv())
      .on("data", (row) => {

        if (row.cnpj) {
          const clean = limparCNPJ(row.cnpj);

          // ✅ valida tamanho do CNPJ
          if (clean.length === 14) {
            lista.add(clean); // ✅ Set usa ADD (não push)
          }
        }

      })
      .on("end", async () => {

        let count = 0;
        const total = lista.size; // ✅ Set usa size

        for (const cnpj of lista) {
          try {
            count++;
            console.log(`🔄 ${count}/${total} - ${cnpj}`);

            const existe = await empresaExiste(cnpj);
            if (existe) {
              console.log(`⚠ Já existe: ${cnpj}`);
              continue;
            }

            const dados = await consultarCNPJ(cnpj);
            if (!dados) continue;

            const empresa = {
              cnpj: dados.cnpj,
              nome: dados.razao_social,
              fantasia: dados.nome_fantasia,
              telefone: dados.ddd_telefone_1,
              email: dados.email,
              situacao: dados.descricao_situacao_cadastral,
              municipio: dados.municipio,
              uf: dados.uf
            };

            await salvarEmpresa(empresa);

            await new Promise(r => setTimeout(r, 2000));

          } catch (err) {
            console.error("Erro:", err.message);
          }
        }

        console.log("Importação finalizada ✅");
        resolve();
      })
      .on("error", reject);
  });
}

module.exports = { processarCSV };