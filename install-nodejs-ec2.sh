#!/bin/bash
# Script de instalación para EC2
# Ejecutar en la instancia EC2 después de conectarse

echo "🚀 Configurando API REST Node.js en AWS EC2..."

# Actualizar el sistema
echo "📦 Actualizando el sistema..."
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18.x
echo "📦 Instalando Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalación
echo "✅ Versiones instaladas:"
node --version
npm --version

# Instalar PM2 globalmente
echo "📦 Instalando PM2..."
sudo npm install -g pm2

# Crear directorio para la aplicación
echo "📁 Creando directorio de aplicación..."
sudo mkdir -p /opt/nodejs-api
sudo chown ubuntu:ubuntu /opt/nodejs-api
cd /opt/nodejs-api

echo "✅ Configuración básica completada!"
echo "📋 Próximo paso: subir los archivos del proyecto"
