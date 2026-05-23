const express = require("express");
const app = express();
const path = require("path");
const db = require("./database");
const { processarCSV } = require("./importar");

app.use(express.static('public'));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// página inicial (últimos registros)
app.get("/", (req, res) => {
  db.all("SELECT * FROM empresas ORDER BY id DESC LIMIT 50", [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.render("error", { message: "Erro no banco de dados" });
    }

    res.render("index", { empresas: rows });
  });
});

// busca
app.get("/buscar", (req, res) => {
  const { q, municipio, uf } = req.query;

  let sql = "SELECT * FROM empresas WHERE 1=1";
  const params = [];

  // busca por nome ou CNPJ
  if (q) {
    sql += " AND (nome LIKE ? OR cnpj LIKE ?)";
    params.push(`%${q}%`, `%${q}%`);
  }

  // filtro município
  if (municipio) {
    sql += " AND municipio = ?";
    params.push(municipio);
  }

  // filtro UF
  if (uf) {
    sql += " AND uf = ?";
    params.push(uf);
  }

  sql += " ORDER BY id DESC LIMIT 50";

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.render("error", { message: "Erro na busca" });
    }

    res.render("index", { empresas: rows });
  });
});


// importar sem travar o servidor
processarCSV()
  .then(() => console.log("Importação inicial concluída ✅"))
  .catch(err => console.error(err));

// atualização automática
setInterval(() => {
  console.log("Atualizando dados...");
  processarCSV();
}, 1000 * 60 * 60 * 6);

const open = require("open");

app.listen(3000, () => {
  console.log("Servidor rodando...");
  open("http://localhost:3000");
});
