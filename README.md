Gestor de Notas con Autenticación
Aplicación web fullstack para crear, editar, eliminar y listar notas personales, protegidas por autenticación JWT.
Desarrollada con React, TypeScript, Node.js, Express, y Supabase como base de datos.

Tecnologías usadas
Frontend
React + TypeScript
Axios
Tailwind CSS

Backend
C# (.NET)
Node.js + Express
Autenticación JWT
Supabase (PostgreSQL)
Jest + Supertest (tests básicos)

Funcionalidades
Registro y login de usuario
Persistencia de sesión con JWT
CRUD completo de notas
Notas privadas por usuario
Logout seguro
Validaciones básicas y manejo de errores
Tests unitarios y de integración en backend

Cómo correr el proyecto localmente

Backend
+--bash-------+
| cd backend |
| npm install |
| npm run dev |
+-------------+

Frontend
+--bash-------+
| cd frontend |
| npm install |
| npm run dev |
+-------------+

Variables de entorno

Backend (.env)
PORT=3000
JWT_SECRET=tu_secreto
SUPABASE_URL=https://...
SUPABASE_KEY=...

Frontend (.env)
VITE_API_URL=http://localhost:3000
