const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./empresas.db', (err) => {
  if (err) {
    console.error("Erro ao conectar:", err.message);
  } else {
    console.log("Banco conectado ✅");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS empresas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cnpj TEXT UNIQUE,
      nome TEXT,
      fantasia TEXT,
      telefone TEXT,
      email TEXT,
      instagram TEXT,
      facebook TEXT,
      linkedin TEXT,
      website TEXT,
      situacao TEXT,
      municipio TEXT,
      uf TEXT
    )
  `, (err) => {
    if (err) {
      console.error("Erro ao criar tabela:", err.message);
    } else {
      console.log("Tabela empresas pronta ✅");
    }
  });
});


module.exports = db;