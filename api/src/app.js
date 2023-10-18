import express, { json } from 'express';
import cors from 'cors';
import mysql from 'mysql2';

const connection = mysql.createConnection({
    host: 'mysql',
    user: 'root',
    password: 'admin',
    database: 'vbooks'
  });

const app = express();
var id = 0;
var livres = [{id: ++id, titre: "J'aime BZ", auteur: "Thomas VATE", description: "Best seller mondial", date:2023}];


app.use(cors())
app.use(json());

app.use((req, _res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.get('/api/livres', (_req, res) => {
    const sql = 'SELECT * FROM livre;'
    connection.query(sql, function(err, results) {
        if (err) {
            console.error(err.message);
            res.status(500).send(err.message);
        }
        res.json(results);
    });
});

app.post('/api/livres', (req, res) => {
    const livre = req.body;
    const sql = `INSERT INTO livre (titre, auteur, description, date) VALUES ("${livre.titre}", "${livre.auteur}", "${livre.description}", ${livre.date})`;
    connection.query(sql, function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).send(err.message);
        }
        res.send('OK');
    });
});

app.get('/api/livres/:livreID', (req, res) => {
    const id = Number(req.params.livreID);
    const livre = livres.find(livre => livre.id === id);

    if (!livre) {
        return res.status(404).send('Livre not found');
    }
    res.json(livre);
});

app.get('', (req, res) => {
    return res.status(404).send('BAD URI');
});

app.listen(8080, () => {
    console.log('api is listening on port 8080');
});