# Gestor de Notas con Autenticación

Aplicación web fullstack. Desarrollada con React, TypeScript, Node.js, Express, y SSMS (local) como base de datos.

# Tecnologías usadas

$Frontend
React + TypeScript
Axios
Tailwind CSS

$Backend
Node.js + Express
Autenticación JWT
SSMS (Sql Server Management Studio 20)
Tedious

# Funcionalidades

Autenticación completa - Login - Logout Seguro y registro de usuarios.
Seguridad - Autenticación JWT (Persistencia de sesión incluida) y validación de datos.
Interface moderna - UI responsiva con Tailwind CSS
Base de datos robusta - SQL Server con queries optimizadas y CRUD completo de notas.
Notas privadas por usuario
Validaciones básicas y manejo de errores

# Stack Tecnológico

## Frontend

React 18 con TypeScript
Tailwind CSS para estilos
React Router para navegación
Context API para manejo de estado
Vite como build tool

## Backend

Node.js con TypeScript
Express.js para el servidor
JWT para autenticación
bcrypt para encriptación de contraseñas
SQL Server como base de datos

# Demo

Funcionalidades principales:

Login/Registro de usuarios
Dashboard de notas personal
Editor de notas en tiempo real
Eliminación con confirmación
Interface responsive

# Perrequisitos

Antes de comenzar, asegúrate de tener instalado:

Node.js (v18 o superior)
SQL Server (LocalDB o Express)
Git
Un editor de código (recomendado: VS Code)

# Como probar el PROYECTO

Instalación Rápida

1- Clonar Repositorio
git clone https://github.com/corvy-NaN/notesAPI
cd NotesProject

2-Configuracion de Variables de Entorno (.env)
cp .env.example .env

# Variables de entorno

Backend (.env)
PORT=3000
JWT_SECRET=tu_secreto

Frontend (.env)
VITE_API_URL=http://localhost:3000

# Instalacion de Dependencias Para el Back y el Front

cd backend
npm install

cd frontend
npm install

# Configuración

(.env)----------

# Servidor

PORT=3001
HOST=localhost
NODE_ENV=development

# Base de Datos

DB_SERVER=localhost
DB_DATABASE=NotesApp
DB_USER=tu_usuario
DB_PASSWORD=tu_password

# JWT

## JWT_SECRET=tu_jwt_secret_super_seguro_aqui

# Configuración Base de Datos

CREATE TABLE Users (
Id int IDENTITY(1,1) PRIMARY KEY,
Username nvarchar(50) UNIQUE NOT NULL,
Email nvarchar(100),
PasswordHash nvarchar(255) NOT NULL,
CreatedAt datetime2 DEFAULT GETDATE()
);

CREATE TABLE Notes (
Id int IDENTITY(1,1) PRIMARY KEY,
Title nvarchar(200) NOT NULL,
Content nvarchar(MAX) NOT NULL,
UserId int NOT NULL,
CreatedAt datetime2 DEFAULT GETDATE(),
UpdatedAt datetime2 DEFAULT GETDATE(),
FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

# $ Cómo correr el proyecto localmente? $

cd backend
npm run dev

cd frontend
npm run dev

# PROYECTO CORRIENDO (Back en host: 3001 y Front en host: 5173)

# AUTOR

GitHub: [@corvy-NaN] (https://github.com/corvy-NaN)
LinkedIn: [maximiliano-najlowiec](https://www.linkedin.com/in/maximiliano-najlowiec/)
Email: najlowiec.maximiliano@gmail.com
