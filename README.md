# 🏢 Sistema de Consulta de Empresas

Projeto desenvolvido em Node.js para consulta de dados de empresas através de CNPJ ou nome.

---

## 🚀 Funcionalidades

- Importação de CNPJs via arquivo CSV
- Consulta automática via BrasilAPI
- Armazenamento em banco SQLite
- Busca por nome ou CNPJ
- Interface web com EJS
- Atualização automática dos dados
- Geração de executável (.exe)

---

## 🛠 Tecnologias utilizadas

- Node.js
- Express
- SQLite3
- EJS
- Axios
- CSV Parser

---

## 📂 Estrutura do projeto

```text
baseDados/
├── app.js
├── database.js
├── importar.js
├── empresas.db
├── cnpjs.csv
├── views/
│   └── index.ejs
├── public/
│   └── styles/
│       └── main.css
```

---

## ▶️ Como executar o projeto

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor:
   ```bash
   node app.js
   ```

---

## 📌 Como usar

1. Adicione os CNPJs no arquivo `cnpjs.csv`.
2. Execute o sistema.
3. Acesse no seu navegador: [http://localhost:3000](http://localhost:3000)

---

## 📦 Executável

O projeto pode ser convertido em um arquivo executável para Windows (`.exe`) usando o comando:

```bash
npx pkg . --targets node18-win-x64
```

---

## 👨‍💻 Autor

Desenvolvido por **Ihury Ferreira**
