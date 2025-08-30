#!/bin/bash

# Script para configurar la API en AWS EC2
# Ejecutar como sudo en la instancia EC2

echo "🚀 Configurando API REST Node.js en AWS EC2..."

# Actualizar el sistema
echo "📦 Actualizando el sistema..."
apt update && apt upgrade -y

# Instalar Node.js
echo "📦 Instalando Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Verificar instalación
echo "✅ Versiones instaladas:"
node --version
npm --version

# Instalar PM2 globalmente
echo "📦 Instalando PM2..."
npm install -g pm2

# Crear directorio para la aplicación
echo "📁 Creando directorio de aplicación..."
mkdir -p /opt/nodejs-api
cd /opt/nodejs-api

# Aquí deberías subir tus archivos de proyecto
echo "📋 Recuerda subir los archivos del proyecto a /opt/nodejs-api"
echo "Puedes usar: scp -i tu-key.pem -r ./proyecto ubuntu@tu-ip:/opt/nodejs-api/"

# Instalar dependencias (ejecutar después de subir los archivos)
echo "📦 Para instalar dependencias después de subir archivos:"
echo "cd /opt/nodejs-api && npm install"

# Iniciar con PM2
echo "🚀 Para iniciar la aplicación:"
echo "pm2 start server.js --name api-rest"
echo "pm2 startup"
echo "pm2 save"

# Configurar firewall
echo "🔥 Configurando firewall..."
ufw allow 22
ufw allow 80
ufw allow 443
ufw allow 3000
ufw --force enable

echo "✅ Configuración básica completada!"
echo "🔗 Asegúrate de configurar el Security Group en AWS para permitir el puerto 3000"
