const sqlite3 = require('sqlite3').verbose();
const path = require('path');

console.log('🔍 Verificando base de datos SQLite desde Node.js...');
console.log('===================================================');

// Ruta de la base de datos
const dbPath = path.join(__dirname, 'database.sqlite');
console.log(`📁 Ruta de la base de datos: ${dbPath}`);

// Conectar a la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error al conectar:', err.message);
        return;
    }
    console.log('✅ Conexión exitosa a la base de datos SQLite');
});

// Verificar tablas
db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
    if (err) {
        console.error('❌ Error al consultar tablas:', err.message);
        return;
    }

    console.log(`\n📋 Número de tablas: ${tables.length}`);
    console.log('📋 Tablas encontradas:');

    tables.forEach((table, index) => {
        console.log(`   ${index + 1}. ${table.name}`);
    });

    // Verificar contenido de cada tabla
    let tablesChecked = 0;
    const totalTables = tables.length;

    tables.forEach(table => {
        db.get(`SELECT COUNT(*) as count FROM ${table.name}`, [], (err, result) => {
            if (err) {
                console.error(`❌ Error al contar registros en ${table.name}:`, err.message);
            } else {
                console.log(`   📊 ${table.name}: ${result.count} registros`);
            }

            tablesChecked++;
            if (tablesChecked === totalTables) {
                console.log('\n✅ Verificación completada desde Node.js');
                db.close();
            }
        });
    });
});
