# Comandos para verificar la base de datos SQLite en AWS

# 1. Verificar que el archivo existe
ls -la database.sqlite

# 2. Ver el tamaño del archivo
du -h database.sqlite

# 3. Conectar a SQLite y ver tablas
sqlite3 database.sqlite ".tables"

# 4. Ver esquema de las tablas
sqlite3 database.sqlite ".schema"

# 5. Ver contenido de las tablas
sqlite3 database.sqlite "SELECT name FROM sqlite_master WHERE type='table';"

# 6. Contar registros en cada tabla
sqlite3 database.sqlite "SELECT 'users' as table_name, COUNT(*) as count FROM users UNION ALL SELECT 'products' as table_name, COUNT(*) as count FROM products;"

# 7. Ver algunos registros de ejemplo
sqlite3 database.sqlite "SELECT * FROM users LIMIT 5;"
sqlite3 database.sqlite "SELECT * FROM products LIMIT 5;"
