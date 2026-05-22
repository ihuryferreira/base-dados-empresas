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
  const termo = req.query.q;

  if (!termo) return res.redirect("/");

  const like = `%${termo}%`;

  db.all(`
    SELECT * FROM empresas
    WHERE nome LIKE ? OR cnpj LIKE ?
    LIMIT 50
  `, [like, like], (err, rows) => {

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
