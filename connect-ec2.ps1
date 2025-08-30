# Script de conexión SSH para Windows
# Guarda este archivo como connect-ec2.ps1

# Reemplaza TU_IP_PUBLICA con la IP real de tu instancia
$EC2_IP = "TU_IP_PUBLICA"
$KEY_PATH = "C:\path\to\vockey.pem"  # Ajusta la ruta a tu clave

Write-Host "🔌 Conectando a la instancia EC2: $EC2_IP"
Write-Host "📁 Usando clave: $KEY_PATH"

# Comando SSH
ssh -i $KEY_PATH ubuntu@$EC2_IP

# Si no tienes SSH en Windows, puedes usar PuTTY:
# 1. Descarga PuTTY desde https://www.putty.org/
# 2. Convierte vockey.pem a .ppk usando PuTTYgen
# 3. Usa PuTTY para conectarte
