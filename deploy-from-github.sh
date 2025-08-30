#!/bin/bash
# Script completo para desplegar desde GitHub en EC2
# Ejecutar línea por línea después de conectarse via SSH

echo "🚀 Desplegando API Node.js desde GitHub en EC2..."

# 1. Actualizar sistema
echo "📦 Actualizando sistema..."
sudo apt update && sudo apt upgrade -y

# 2. Instalar Node.js
echo "📦 Instalando Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Verificar instalaciones
echo "✅ Verificando versiones:"
node --version
npm --version

# 4. Instalar PM2
echo "📦 Instalando PM2..."
sudo npm install -g pm2

# 5. Instalar Git
echo "📦 Instalando Git..."
sudo apt install git -y

# 6. Ir al directorio home
cd /home/ubuntu

# 7. Clonar repositorio (REEMPLAZA CON TU URL)
echo "📁 Clonando repositorio desde GitHub..."
echo "⚠️  IMPORTANTE: Reemplaza la siguiente URL con tu repositorio real:"
echo "git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git"
# git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git

echo ""
echo "📋 Después de clonar, ejecuta:"
echo "cd TU_REPOSITORIO"
echo "npm install"
echo "pm2 start server.js --name api-rest"
echo "pm2 startup"
echo "pm2 save"
echo ""
echo "🧪 Para probar:"
echo "curl http://localhost:3000/health"
