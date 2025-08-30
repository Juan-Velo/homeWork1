# API REST con Node.js y SQLite3 para AWS

Este proyecto implementa una API REST completa usando Node.js, Express y SQLite3, diseñada para ser desplegada en AWS.

## 🚀 Características

- **Framework**: Express.js
- **Base de datos**: SQLite3
- **Seguridad**: Helmet, CORS
- **Endpoints**: CRUD completo para usuarios y productos
- **Preparado para AWS**: Configuración para EC2 y otros servicios

## 📋 Requisitos

- Node.js >= 16.0.0
- npm >= 7.0.0

## 🛠️ Instalación

1. Clona o descarga el proyecto
2. Instala las dependencias:
```bash
npm install
```

## 🎯 Uso

### Desarrollo local
```bash
npm run dev
```

### Producción
```bash
npm start
```

La API estará disponible en `http://localhost:3000`

## 📝 Endpoints disponibles

### Información general
- `GET /` - Información de la API
- `GET /health` - Health check

### Usuarios
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `POST /api/users` - Crear nuevo usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Productos
- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

## 📊 Ejemplos de uso con Postman

### Crear un usuario
```
POST /api/users
Content-Type: application/json

{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "age": 30
}
```

### Crear un producto
```
POST /api/products
Content-Type: application/json

{
    "name": "Laptop HP",
    "description": "Laptop HP Pavilion 15\"",
    "price": 899.99,
    "stock": 10
}
```

## 🔧 Configuración para AWS

### EC2 (Amazon Elastic Compute Cloud)

1. **Crear instancia EC2**:
   - Selecciona una AMI de Ubuntu 20.04 LTS
   - Tipo de instancia: t2.micro (elegible para capa gratuita)
   - Configura el Security Group para permitir:
     - SSH (puerto 22) desde tu IP
     - HTTP (puerto 80) desde cualquier lugar
     - Puerto personalizado 3000 desde cualquier lugar

2. **Conectar a la instancia**:
```bash
ssh -i "tu-key.pem" ubuntu@tu-ip-publica
```

3. **Instalar Node.js en la instancia**:
```bash
# Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalación
node --version
npm --version
```

4. **Subir el proyecto**:
```bash
# Opción 1: Usar git
git clone [tu-repositorio]

# Opción 2: Usar scp
scp -i "tu-key.pem" -r ./proyecto ubuntu@tu-ip-publica:~/
```

5. **Instalar dependencias y ejecutar**:
```bash
cd proyecto
npm install
npm start
```

6. **Usar PM2 para mantener la aplicación ejecutándose**:
```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Iniciar la aplicación con PM2
pm2 start server.js --name "api-rest"

# Configurar PM2 para que inicie automáticamente
pm2 startup
pm2 save
```

### Configuración del Security Group

Para permitir el tráfico HTTP/HTTPS en AWS EC2:

1. Ve a EC2 Console > Security Groups
2. Selecciona tu security group
3. Añade las siguientes reglas de entrada:

| Tipo | Protocolo | Puerto | Origen |
|------|-----------|--------|--------|
| SSH | TCP | 22 | Tu IP |
| HTTP | TCP | 80 | 0.0.0.0/0 |
| HTTPS | TCP | 443 | 0.0.0.0/0 |
| Custom TCP | TCP | 3000 | 0.0.0.0/0 |

### Proxy Reverso con Nginx (Opcional)

Para usar el puerto 80 estándar:

1. **Instalar Nginx**:
```bash
sudo apt install nginx -y
```

2. **Configurar Nginx**:
```bash
sudo nano /etc/nginx/sites-available/default
```

Contenido:
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

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

3. **Reiniciar Nginx**:
```bash
sudo systemctl restart nginx
```

## 🧪 Pruebas con Postman

1. **Importar la colección**: Descarga Postman desde https://www.postman.com/
2. **Crear una nueva colección** llamada "API REST Node.js"
3. **Configurar requests**:

### Variables de entorno en Postman
- `base_url`: `http://tu-ip-aws:3000` o `http://localhost:3000`

### Requests de ejemplo:

1. **GET Health Check**
   - URL: `{{base_url}}/health`
   - Method: GET

2. **GET Todos los usuarios**
   - URL: `{{base_url}}/api/users`
   - Method: GET

3. **POST Crear usuario**
   - URL: `{{base_url}}/api/users`
   - Method: POST
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
   ```json
   {
       "name": "Ana García",
       "email": "ana@example.com",
       "age": 25
   }
   ```

4. **PUT Actualizar usuario**
   - URL: `{{base_url}}/api/users/1`
   - Method: PUT
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
   ```json
   {
       "name": "Ana García López",
       "email": "ana.garcia@example.com",
       "age": 26
   }
   ```

5. **DELETE Eliminar usuario**
   - URL: `{{base_url}}/api/users/1`
   - Method: DELETE

## 🗄️ Base de datos

La base de datos SQLite se crea automáticamente al iniciar la aplicación. Incluye:

### Tabla `users`
- `id` (INTEGER, PRIMARY KEY, AUTOINCREMENT)
- `name` (TEXT, NOT NULL)
- `email` (TEXT, UNIQUE, NOT NULL)
- `age` (INTEGER)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

### Tabla `products`
- `id` (INTEGER, PRIMARY KEY, AUTOINCREMENT)
- `name` (TEXT, NOT NULL)
- `description` (TEXT)
- `price` (REAL, NOT NULL)
- `stock` (INTEGER)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

## 🔒 Seguridad

- **Helmet**: Protección de headers HTTP
- **CORS**: Control de acceso de origen cruzado
- **Validación**: Validación básica de entrada
- **Sanitización**: Protección contra inyección SQL usando prepared statements

## 📈 Monitoreo

La aplicación incluye:
- Logging de requests
- Health check endpoint
- Manejo de errores centralizado

## 🚀 Despliegue en AWS

### Opciones de despliegue:

1. **EC2**: Máquina virtual completa (recomendado para este ejercicio)
2. **Elastic Beanstalk**: Plataforma como servicio
3. **Lambda + API Gateway**: Serverless
4. **ECS**: Contenedores Docker

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

MIT License
