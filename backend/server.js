const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Importa o driver do PostgreSQL

const app = express();
app.use(cors());
app.use(express.json());

// ----------- Simulando dados que depois virão do Amazon RDS ------------- //
//  const cardapioFake = [
//      { id: 1, nome: "Hambúrguer Serverless", preco: 28.50, descricao: "Grelhado na hora com queijo cheddar derretido." },
//      { id: 2, nome: "Batata Frita SQS", preco: 14.00, descricao: "Batatas crocantes que chegam em fila e quentinhas." },
//      { id: 3, nome: "Suco de Laranja Dynamo", preco: 9.00, descricao: "Suco natural feito de forma ultra rápida." }
//  ];
//  app.get('/cardapio', (req, res) => {
//      console.log("Front-end solicitou o cardápio!");
//      res.json(cardapioFake);
//  });


// Configuração da conexão com o Amazon RDS usando variáveis de ambiente
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
    ssl: { rejectUnauthorized: false } // Obrigatório para conexões seguras na AWS
});

// Rota para buscar o cardápio direto do Amazon RDS
app.get('/cardapio', async (req, res) => {
    try {
        console.log("Buscando cardápio no Amazon RDS...");
        const resultado = await pool.query('SELECT * FROM cardapio');
        res.json(resultado.rows); // Retorna as linhas do banco de dados
    } catch (erro) {
        console.error("Erro ao consultar o RDS:", erro);
        res.status(500).json({ erro: "Erro ao buscar dados no banco de dados." });
    }
});

app.post('/cardapio', async (req, res) => {
    try{
        const {id, nome, descricao, preco, tipo} = req.body;

        if (tipo == 'create'){
            const sql = "INSERT INTO cardapio (nome, preco, descricao) VALUES ($1,$2,$3) RETURNING *;";
            const values = [nome, preco, descricao];

            const resultado = await pool.query(sql, values);
            
            return res.status(201).json({
                msg : "Registro Inserido com sucesso!"
            });
        }
        else if (tipo == 'edit'){
            const sql = "UPDATE CARDAPIO SET NOME = $1, PRECO = $2, DESCRICAO = $3 WHERE ID = $4;";
            const values = [nome, preco, descricao, id];

            const resultado = await pool.query(sql, values);
            
            return res.status(200).json({
                msg : "Registro Alterado com sucesso!"
            });
        }
        else if (tipo == 'destroy'){
            const sql = "DELETE FROM CARDAPIO WHERE ID = $1;";
            const values = [id];

            const resultado = await pool.query(sql, values);
            
            return res.status(200).json({
                msg : "Registro Removido com sucesso!"
            });
        }
        else{
            console.error("Parâmetros inválidos para a requisição:");
            res.status(500).json({ erro: "Erro ao modificar dados no banco de dados." });
        }
    } catch (erro) {
        console.error("Erro ao consultar o RDS:", erro);
        res.status(500).json({ erro: "Erro ao alterar dados no banco de dados." });
    }
});


async function inicializarBanco() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS cardapio (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(100),
                preco NUMERIC(10,2),
                descricao TEXT
            );
        `);
        
        const checar = await pool.query('SELECT COUNT(*) FROM cardapio');
        if (parseInt(checar.rows[0].count) === 0) {
            await pool.query(`
                INSERT INTO cardapio (nome, preco, descricao) VALUES 
                ('Hambúrguer Nuvem AWS', 32.00, 'Grelhado no fogo com queijo prato e molho especial.'),
                ('Batata Frita Kubernetes', 16.00, 'Crocantes por fora, macias por dentro.'),
                ('Combo Cluster', 45.00, 'Lanche + Batata + Refri.');
                ('Suco Dynamo', 8.00, 'Rápido e Refrescante.');
            `);
            console.log("Banco de dados inicializado com lanches de teste!");
        }
    } catch (err) {
        console.error("Erro ao inicializar tabelas:", err);
    }
}
inicializarBanco();

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Back-end rodando com sucesso na porta ${PORT}`);
});