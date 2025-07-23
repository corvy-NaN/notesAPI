# NotesAPI

Una API RESTful construida con ASP.NET Core y Entity Framework Core.
Permite crear, leer y eliminar notas desde una base de datos SQL Server.

## Tecnologías utilizadas

- .NET 8
- ASP.NET Core
- Entity Framework Core (EF Core)
- SQL Server Express
- Swagger para documentación
- Postman (para pruebas)

## Cómo correr el proyecto

1. **Cloná el repositorio:**

   (En Terminal)
   git clone https://github.com/tu-usuario/NotesAPI.git
   cd NotesAPI

2. **Restaurá las dependencias**

   (En Terminal)
   dotnet restore

3. **Migración Inicial**

   (En Terminal)
   dotnet ef migrations add InitialCreate
   dotnet ef database update

4. **Ejecución de servidor**

   (En Terminal)
   dotnet run