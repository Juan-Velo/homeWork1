const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Base de datos SQLite
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
        initializeDatabase();
    }
});

// Inicializar la base de datos
function initializeDatabase() {
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            age INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;

    const createProductsTable = `
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            stock INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;

    db.run(createUsersTable, (err) => {
        if (err) {
            console.error('Error creando tabla users:', err.message);
        } else {
            console.log('Tabla users creada o ya existe.');
        }
    });

    db.run(createProductsTable, (err) => {
        if (err) {
            console.error('Error creando tabla products:', err.message);
        } else {
            console.log('Tabla products creada o ya existe.');
        }
    });
}

// Middleware para logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        message: 'API REST con Node.js y SQLite3',
        version: '1.0.0',
        endpoints: {
            users: '/api/users',
            products: '/api/products'
        },
        status: 'OK'
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// RUTAS PARA USUARIOS

// GET /api/users - Obtener todos los usuarios
app.get('/api/users', (req, res) => {
    const sql = 'SELECT * FROM users ORDER BY created_at DESC';
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows,
            count: rows.length
        });
    });
});

// GET /api/users/:id - Obtener un usuario por ID
app.get('/api/users/:id', (req, res) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const params = [req.params.id];
    
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.json({
                message: 'success',
                data: row
            });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    });
});

// POST /api/users - Crear un nuevo usuario
app.post('/api/users', (req, res) => {
    const { name, email, age } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ error: 'Nombre y email son requeridos' });
    }

    const sql = 'INSERT INTO users (name, email, age) VALUES (?, ?, ?)';
    const params = [name, email, age];
    
    db.run(sql, params, function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                res.status(400).json({ error: 'El email ya existe' });
            } else {
                res.status(500).json({ error: err.message });
            }
            return;
        }
        res.status(201).json({
            message: 'Usuario creado exitosamente',
            data: {
                id: this.lastID,
                name,
                email,
                age
            }
        });
    });
});

// PUT /api/users/:id - Actualizar un usuario
app.put('/api/users/:id', (req, res) => {
    const { name, email, age } = req.body;
    const userId = req.params.id;
    
    if (!name || !email) {
        return res.status(400).json({ error: 'Nombre y email son requeridos' });
    }

    const sql = 'UPDATE users SET name = ?, email = ?, age = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const params = [name, email, age, userId];
    
    db.run(sql, params, function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                res.status(400).json({ error: 'El email ya existe' });
            } else {
                res.status(500).json({ error: err.message });
            }
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ message: 'Usuario no encontrado' });
        } else {
            res.json({
                message: 'Usuario actualizado exitosamente',
                data: {
                    id: userId,
                    name,
                    email,
                    age
                }
            });
        }
    });
});

// DELETE /api/users/:id - Eliminar un usuario
app.delete('/api/users/:id', (req, res) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    const params = [req.params.id];
    
    db.run(sql, params, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ message: 'Usuario no encontrado' });
        } else {
            res.json({ message: 'Usuario eliminado exitosamente' });
        }
    });
});

// RUTAS PARA PRODUCTOS

// GET /api/products - Obtener todos los productos
app.get('/api/products', (req, res) => {
    const sql = 'SELECT * FROM products ORDER BY created_at DESC';
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows,
            count: rows.length
        });
    });
});

// GET /api/products/:id - Obtener un producto por ID
app.get('/api/products/:id', (req, res) => {
    const sql = 'SELECT * FROM products WHERE id = ?';
    const params = [req.params.id];
    
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.json({
                message: 'success',
                data: row
            });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    });
});

// POST /api/products - Crear un nuevo producto
app.post('/api/products', (req, res) => {
    const { name, description, price, stock } = req.body;
    
    if (!name || !price) {
        return res.status(400).json({ error: 'Nombre y precio son requeridos' });
    }

    const sql = 'INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)';
    const params = [name, description, price, stock || 0];
    
    db.run(sql, params, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({
            message: 'Producto creado exitosamente',
            data: {
                id: this.lastID,
                name,
                description,
                price,
                stock: stock || 0
            }
        });
    });
});

// PUT /api/products/:id - Actualizar un producto
app.put('/api/products/:id', (req, res) => {
    const { name, description, price, stock } = req.body;
    const productId = req.params.id;
    
    if (!name || !price) {
        return res.status(400).json({ error: 'Nombre y precio son requeridos' });
    }

    const sql = 'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const params = [name, description, price, stock, productId];
    
    db.run(sql, params, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ message: 'Producto no encontrado' });
        } else {
            res.json({
                message: 'Producto actualizado exitosamente',
                data: {
                    id: productId,
                    name,
                    description,
                    price,
                    stock
                }
            });
        }
    });
});

// DELETE /api/products/:id - Eliminar un producto
app.delete('/api/products/:id', (req, res) => {
    const sql = 'DELETE FROM products WHERE id = ?';
    const params = [req.params.id];
    
    db.run(sql, params, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ message: 'Producto no encontrado' });
        } else {
            res.json({ message: 'Producto eliminado exitosamente' });
        }
    });
});

// Manejo de errores 404
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Endpoint no encontrado' });
});

// Manejo de errores globales
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ message: 'Error interno del servidor' });
});

// Cerrar la base de datos cuando la aplicación termine
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Conexión a la base de datos cerrada.');
        process.exit(0);
    });
});

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Servidor ejecutándose en puerto ${PORT}`);
    console.log(`📊 API disponible en: http://localhost:${PORT}`);
    console.log(`🔍 Health check: http://localhost:${PORT}/health`);
    console.log(`👥 Usuarios: http://localhost:${PORT}/api/users`);
    console.log(`📦 Productos: http://localhost:${PORT}/api/products`);
});

module.exports = app;
