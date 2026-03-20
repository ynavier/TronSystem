# ⬡ TRON INVENTORY

> // Sistema de gestión de inventario tecnológico v3.0.7

![Angular](https://img.shields.io/badge/Angular-17-dd0031?style=flat-square&logo=angular)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)

Aplicación fullstack de gestión de inventario con estética **cyberpunk / TRON**. Construida con Angular, Node.js, Express, MongoDB Atlas y TypeScript de punta a punta.

---

## 🎬 Vista previa

| Landing | Inventario | Detalle |
|--------|-----------|---------|
| Motos de luz animadas sobre cuadrícula | Tabla con filtros y stats | Modal con detalle completo del producto |

---

## 🧱 Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| 🅰️ Frontend | Angular 17 (Standalone) |
| 🟢 Backend | Node.js + Express |
| 🍃 Base de datos | MongoDB Atlas + Mongoose |
| 🔷 Lenguaje | TypeScript (frontend y backend) |
| 🎨 Estilos | CSS puro con fuentes Share Tech Mono + Rajdhani |

---

## 📁 Estructura del proyecto

```
inventario-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts               # Conexión a MongoDB Atlas
│   │   ├── models/
│   │   │   └── product.model.ts    # Schema de Mongoose
│   │   ├── controllers/
│   │   │   └── product.controller.ts
│   │   ├── routes/
│   │   │   └── product.routes.ts
│   │   └── index.ts                # Entry point del servidor
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    └── src/
        └── app/
            ├── models/
            │   └── product.ts
            ├── services/
            │   └── product.service.ts
            └── components/
                ├── landing/         # Landing page con animación TRON
                └── product-list/    # CRUD principal
```

---

## ✨ Funcionalidades

- 🏍️ **Landing animada** con motos de luz que se mueven por la cuadrícula, chocan y explotan
- 📦 **CRUD completo** de productos (crear, leer, actualizar, eliminar)
- 🔍 **Filtros** por nombre, categoría y rango de precio
- 📊 **Stats en tiempo real** — total de productos, unidades y valor del inventario
- 🏷️ **Estados automáticos** — Activo, Stock Bajo (≤5 unidades), Descontinuado (0 unidades)
- 🪟 **Modal de detalle** al hacer clic en el nombre del producto
- 🔔 **Notificaciones toast** al crear, actualizar o eliminar
- 📱 **Responsive** para móvil y tablet
- ☁️ **Persistencia en MongoDB Atlas**

---

## 🚀 Instalación y configuración

### Prerequisitos

Asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) v18 o superior
- [Angular CLI](https://angular.dev/tools/cli) v17 o superior
- Cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas) (gratuita)

```bash
node -v        # v18+
npm -v         # 9+
ng version     # 17+
```

---

### 🔧 Backend

```bash
# 1. Entrar a la carpeta
cd backend

# 2. Instalar dependencias
npm install

# 3. Crear el archivo de variables de entorno
# Crea un archivo .env con el siguiente contenido:
```

```env
PORT=3000
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster0.xxxxx.mongodb.net/inventario?retryWrites=true&w=majority
```

> 💡 Reemplaza `<usuario>` y `<password>` con tus credenciales de MongoDB Atlas.

```bash
# 4. Levantar el servidor en modo desarrollo
npm run dev
```

El servidor estará disponible en `http://localhost:3000` ✅

---

### 🅰️ Frontend

```bash
# 1. Entrar a la carpeta
cd frontend

# 2. Instalar dependencias
npm install

# 3. Levantar el servidor de desarrollo
ng serve
```

La aplicación estará disponible en `http://localhost:4200` ✅

---

## 🌐 Endpoints REST

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/products` | Obtener todos los productos |
| `GET` | `/api/products/:id` | Obtener producto por ID |
| `POST` | `/api/products` | Crear nuevo producto |
| `PUT` | `/api/products/:id` | Actualizar producto |
| `DELETE` | `/api/products/:id` | Eliminar producto |

---

## 📦 Modelo de datos

```typescript
{
  nombre:      string   // requerido
  descripcion: string   // opcional
  precio:      number   // requerido, mínimo 0
  cantidad:    number   // requerido, mínimo 0
  categoria:   string   // requerido
  createdAt:   Date     // automático
  updatedAt:   Date     // automático
}
```

### Categorías disponibles

`Laptops` · `Componentes` · `Periféricos` · `Almacenamiento` · `Smartphones` · `Otros`

---

## 🎮 Animación TRON — cómo funciona

La landing page incluye una animación canvas con motos de luz inspiradas en el juego TRON:

- Cada moto se mueve sobre la cuadrícula usando **interpolación lineal** para un movimiento fluido
- Las motos giran 90° aleatoriamente cada 4-9 pasos
- La estela se desvanece con **opacidad y grosor progresivos**
- Cuando una moto **choca con la estela de otra** se dispara una explosión con partículas, flash central y anillo expansivo
- La moto **reaparece** en una posición aleatoria 800ms después

---

## 🛠️ Scripts disponibles

### Backend

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor con nodemon + ts-node |
| `npm run build` | Compila TypeScript a JavaScript |
| `npm start` | Inicia el servidor compilado |

### Frontend

| Comando | Descripción |
|---------|-------------|
| `ng serve` | Servidor de desarrollo en puerto 4200 |
| `ng build` | Compilación de producción |

---

## 👨‍💻 Autor

Desarrollado como proyecto de Arquitectura Web — 2026

---

*// END OF LINE*
