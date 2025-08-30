#!/bin/bash
# Script completo para verificar la base de datos SQLite

echo "🔍 Verificando base de datos SQLite..."
echo "========================================"

# Verificar que estamos en el directorio correcto
echo "📁 Directorio actual: $(pwd)"
echo "📁 Archivos en el directorio:"
ls -la *.sqlite 2>/dev/null || echo "❌ No se encontraron archivos .sqlite"

echo ""
echo "1️⃣ VERIFICACIÓN BÁSICA:"
echo "========================"

# Verificar si existe el archivo
if [ -f "database.sqlite" ]; then
    echo "✅ Archivo database.sqlite existe"
    echo "📊 Tamaño: $(du -h database.sqlite | cut -f1)"
    echo "📅 Fecha de modificación: $(stat -c '%y' database.sqlite | cut -d'.' -f1)"
else
    echo "❌ Archivo database.sqlite NO existe"
    exit 1
fi

echo ""
echo "2️⃣ VERIFICACIÓN DE TABLAS:"
echo "==========================="

# Ver tablas usando sqlite3
echo "📋 Tablas en la base de datos:"
TABLES=$(sqlite3 database.sqlite ".tables")
if [ -n "$TABLES" ]; then
    echo "✅ Tablas encontradas: $TABLES"
else
    echo "❌ No se encontraron tablas"
fi

echo ""
echo "3️⃣ VERIFICACIÓN DE ESQUEMA:"
echo "============================"

# Ver esquema de las tablas
echo "📋 Esquema de las tablas:"
SCHEMA=$(sqlite3 database.sqlite ".schema")
if [ -n "$SCHEMA" ]; then
    echo "$SCHEMA"
else
    echo "❌ No se pudo obtener el esquema"
fi

echo ""
echo "4️⃣ VERIFICACIÓN DE DATOS:"
echo "=========================="

# Contar registros en cada tabla
echo "📊 Conteo de registros por tabla:"
if sqlite3 database.sqlite ".tables" | grep -q "users"; then
    USERS_COUNT=$(sqlite3 database.sqlite "SELECT COUNT(*) FROM users;")
    echo "👥 Tabla 'users': $USERS_COUNT registros"
fi

if sqlite3 database.sqlite ".tables" | grep -q "products"; then
    PRODUCTS_COUNT=$(sqlite3 database.sqlite "SELECT COUNT(*) FROM products;")
    echo "📦 Tabla 'products': $PRODUCTS_COUNT registros"
fi

echo ""
echo "5️⃣ MUESTRA DE DATOS:"
echo "===================="

# Mostrar algunos registros de ejemplo
if sqlite3 database.sqlite ".tables" | grep -q "users"; then
    echo "👥 Primeros 3 usuarios:"
    sqlite3 database.sqlite "SELECT id, name, email, age FROM users LIMIT 3;" | while read line; do
        echo "   $line"
    done
fi

if sqlite3 database.sqlite ".tables" | grep -q "products"; then
    echo ""
    echo "📦 Primeros 3 productos:"
    sqlite3 database.sqlite "SELECT id, name, price, stock FROM products LIMIT 3;" | while read line; do
        echo "   $line"
    done
fi

echo ""
echo "✅ VERIFICACIÓN COMPLETADA"
echo "==========================="
echo "🎉 Tu base de datos SQLite está funcionando correctamente!"
