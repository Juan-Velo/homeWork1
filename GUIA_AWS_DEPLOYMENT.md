# 🎯 GUÍA PASO A PASO PARA DESPLEGAR EN AWS

## 📋 Pre-requisitos
- Cuenta de AWS activa
- Clave SSH (.pem file)
- Cliente SSH (PuTTY en Windows o terminal en Linux/Mac)

## 🚀 PASO 1: Crear instancia EC2

### 1.1 Acceder a la consola AWS
1. Inicia sesión en https://aws.amazon.com/console/
2. Ve a **EC2** > **Launch Instance**

### 1.2 Configurar la instancia
- **Name**: `nodejs-sqlite3-api`
- **AMI**: Ubuntu Server 22.04 LTS (64-bit x86)
- **Instance type**: t2.micro (Free tier eligible)
- **Key pair**: Selecciona o crea una nueva clave SSH
- **Network settings**: 
  - Permitir SSH traffic from: Anywhere
  - Permitir HTTP traffic from: Internet
  - Permitir HTTPS traffic from: Internet

### 1.3 Configurar Security Group
Añadir estas reglas de entrada:

| Type | Protocol | Port Range | Source | Description |
|------|----------|------------|---------|-------------|
| SSH | TCP | 22 | 0.0.0.0/0 | SSH |
| HTTP | TCP | 80 | 0.0.0.0/0 | HTTP |
| HTTPS | TCP | 443 | 0.0.0.0/0 | HTTPS |
| Custom TCP | TCP | 3000 | 0.0.0.0/0 | Node.js API |

### 1.4 Configurar Storage
- **Root volume**: 8 GB gp3 (suficiente para este proyecto)

### 1.5 Launch Instance
- Haz click en **Launch Instance**
- Espera a que el estado sea "Running"

## 🔌 PASO 2: Conectar a la instancia

### 2.1 Obtener la IP pública
1. Ve a **EC2** > **Instances**
2. Selecciona tu instancia
3. Copia la **Public IPv4 address**

### 2.2 Conectar vía SSH

**En Windows (usando PuTTY):**
1. Convierte la clave .pem a .ppk usando PuTTYgen
2. Abre PuTTY
3. Host Name: `ubuntu@TU-IP-PUBLICA`
4. Connection > SSH > Auth > Private key: selecciona tu .ppk
5. Click "Open"

**En Linux/Mac:**
```bash
chmod 400 tu-clave.pem
ssh -i "tu-clave.pem" ubuntu@TU-IP-PUBLICA
```

## 📦 PASO 3: Instalar dependencias en EC2

### 3.1 Actualizar el sistema
```bash
sudo apt update && sudo apt upgrade -y
```

### 3.2 Instalar Node.js
```bash
# Instalar Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalación
node --version
npm --version
```

### 3.3 Instalar PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

## 📁 PASO 4: Subir el proyecto

### 4.1 Crear directorio en el servidor
```bash
sudo mkdir -p /opt/nodejs-api
sudo chown ubuntu:ubuntu /opt/nodejs-api
cd /opt/nodejs-api
```

### 4.2 Opción A: Usar Git (recomendado)
```bash
# Si tienes el proyecto en GitHub
git clone https://github.com/tu-usuario/tu-repositorio.git .

# O crear los archivos manualmente
nano package.json
# Copia el contenido del package.json
# Presiona Ctrl+X, luego Y, luego Enter para guardar

nano server.js
# Copia el contenido del server.js
# Presiona Ctrl+X, luego Y, luego Enter para guardar

nano .env
# Copia el contenido del .env
# Presiona Ctrl+X, luego Y, luego Enter para guardar
```

### 4.2 Opción B: Usar SCP desde tu máquina local
```bash
# Desde tu máquina local (Windows/Linux/Mac)
scp -i "tu-clave.pem" -r ./HOMEWORK/* ubuntu@TU-IP-PUBLICA:/opt/nodejs-api/
```

## 🚀 PASO 5: Ejecutar la aplicación

### 5.1 Instalar dependencias
```bash
cd /opt/nodejs-api
npm install
```

### 5.2 Configurar variables de entorno
```bash
nano .env
```
Asegúrate de que contenga:
```
PORT=3000
NODE_ENV=production
```

### 5.3 Probar la aplicación
```bash
# Prueba rápida
node server.js
```
Deberías ver:
```
🚀 Servidor ejecutándose en puerto 3000
📊 API disponible en: http://localhost:3000
Conectado a la base de datos SQLite.
```

Presiona `Ctrl+C` para detener y continuar con PM2.

### 5.4 Ejecutar con PM2
```bash
# Iniciar la aplicación
pm2 start server.js --name "api-rest"

# Ver el estado
pm2 status

# Ver logs
pm2 logs api-rest

# Configurar para que inicie automáticamente
pm2 startup
pm2 save
```

## 🌐 PASO 6: Verificar que funciona

### 6.1 Probar desde el servidor
```bash
curl http://localhost:3000/health
```

### 6.2 Probar desde tu máquina
Abre tu navegador y ve a:
```
http://TU-IP-PUBLICA:3000/health
```

Deberías ver una respuesta JSON como:
```json
{
    "status": "OK",
    "timestamp": "2025-08-29T...",
    "uptime": 10.123
}
```

## 🧪 PASO 7: Probar con Postman

### 7.1 Descargar Postman
1. Ve a https://www.postman.com/downloads/
2. Descarga e instala Postman

### 7.2 Importar la colección
1. Abre Postman
2. Click en **Import**
3. Sube el archivo `postman_collection.json`

### 7.3 Configurar variables
1. Ve a la colección importada
2. Click en **Variables**
3. Cambia `base_url` a: `http://TU-IP-PUBLICA:3000`

### 7.4 Ejecutar pruebas
1. **Health Check**: GET `/health`
2. **Crear usuario**: POST `/api/users` con body:
   ```json
   {
       "name": "Juan Pérez",
       "email": "juan@example.com",
       "age": 30
   }
   ```
3. **Listar usuarios**: GET `/api/users`
4. **Crear producto**: POST `/api/products` con body:
   ```json
   {
       "name": "Laptop HP",
       "description": "Laptop HP Pavilion 15\"",
       "price": 899.99,
       "stock": 10
   }
   ```

## 🔧 PASO 8: Configuración adicional (Opcional)

### 8.1 Usar Nginx como proxy reverso
```bash
# Instalar Nginx
sudo apt install nginx -y

# Configurar
sudo nano /etc/nginx/sites-available/default
```

Contenido del archivo:
```nginx
server {
    listen 80;
    server_name TU-IP-PUBLICA;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Reiniciar Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

Ahora podrás acceder a tu API en `http://TU-IP-PUBLICA` (puerto 80).

## 🛡️ PASO 9: Seguridad y mantenimiento

### 9.1 Configurar firewall
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw enable
```

### 9.2 Comandos útiles de PM2
```bash
# Ver estado de todas las aplicaciones
pm2 status

# Reiniciar la aplicación
pm2 restart api-rest

# Detener la aplicación
pm2 stop api-rest

# Ver logs en tiempo real
pm2 logs api-rest

# Monitorear recursos
pm2 monit
```

## 🎉 ¡COMPLETADO!

Tu API REST está ahora funcionando en AWS. Puedes acceder a:

- **API Principal**: `http://TU-IP-PUBLICA:3000`
- **Health Check**: `http://TU-IP-PUBLICA:3000/health`
- **Usuarios**: `http://TU-IP-PUBLICA:3000/api/users`
- **Productos**: `http://TU-IP-PUBLICA:3000/api/products`

## 📞 Soporte y troubleshooting

### Problemas comunes:

1. **No se puede conectar**: Verifica el Security Group
2. **Error de permisos**: Usa `sudo` cuando sea necesario
3. **Puerto ocupado**: Cambia el puerto en `.env`
4. **Base de datos**: SQLite se crea automáticamente

### Logs útiles:
```bash
# Logs de la aplicación
pm2 logs api-rest

# Logs del sistema
sudo journalctl -u nginx
```
