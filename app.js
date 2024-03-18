require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000

// Configuración de la conexión a la base de datos
const con = mysql.createConnection({
    host: process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_ADDON_USER,
    port: process.env.MYSQL_ADDON_PORT,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB
});

con.connect((err) => {
    if (err) {
        console.error('Error de conexión:', err);
        return;
    }
    console.log('Conexión a la base de datos exitosa');
});

// Middleware para servir archivos estáticos desde la carpeta public
app.use(express.static('public'));
app.use(express.json());

// obtener datos
app.get('/productos', (req, res) => {
    con.query('SELECT * FROM productos', (err, result) => {
        if (err) {
            console.error('Error al obtener los productos:', err);
            res.status(500).json({ error: 'Error al obtener los productos' });
            return;
        }
        res.json(result);
    });
});

// agregar datos
app.post('/productos', (req, res) => {
    const { nombre, descripcion, precio, stock } = req.body;
    con.query('INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)', [nombre, descripcion, precio, stock], (err, result) => {
        if (err) {
            console.error('Error al agregar el producto:', err);
            res.status(500).json({ error: 'Error al agregar el producto' });
            return;
        }
        res.status(201).json({ message: 'Producto creado correctamente' });
    });
});

//eliminar datos
app.delete('/productos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        con.query('DELETE FROM productos WHERE id = ?', [id]);
        res.status(204).end();
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

// cambiar datos
app.get('/productos/:id', (req, res) => {
    const { id } = req.params;
    con.query('SELECT * FROM productos WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Error al obtener el producto:', err);
            res.status(500).json({ error: 'Error al obtener el producto' });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ error: 'Producto no encontrado' });
            return;
        }
        res.json(result[0]);
    });
});

app.put('/productos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock } = req.body;
    con.query('UPDATE productos SET nombre=?, descripcion=?, precio=?, stock=? WHERE id=?', [nombre, descripcion, precio, stock, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar el producto:', err);
            res.status(500).json({ error: 'Error al actualizar el producto' });
            return;
        }
        res.json({ message: 'Producto actualizado correctamente' });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
