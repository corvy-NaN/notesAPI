using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using NotesAPI.Models;
using NotesAPI.DTOs.Auth;


namespace NotesAPI.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class AuthController : ControllerBase
	{
		private readonly NotesDbContext _context;
		private readonly PasswordHasher<User> _passwordHasher;
        private readonly IConfiguration _configuration;

        public AuthController(NotesDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            _passwordHasher = new PasswordHasher<User>();
        }

		[HttpPost("register")]
		public async Task<IActionResult> Register(RegisterDto dto)
		{
			if (_context.Users.Any(u => u.Username == dto.Username))
				return BadRequest(new { message = "El nombre de usuario ya existe" });

			var user = new User
			{
				Username = dto.Username
			};

			user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);

			_context.Users.Add(user);
			await _context.SaveChangesAsync();

			return Ok(new { message = "success" });
		}

		[HttpPost("login")]
		public async Task<IActionResult> Login(LoginDto dto)
		{
			var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == dto.Username);

			if (user == null)
				return Unauthorized(new { message = "Credenciales Inválidas" });

			var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);

			if (result == PasswordVerificationResult.Failed)
				return Unauthorized(new { message = "Credenciales Inválidas" });


			var claims = new[]
			{
				new Claim(ClaimTypes.Name, user.Username),
				new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
			};


			var keyString = _configuration["Jwt:Key"];
			if (keyString is null)
				return StatusCode(500, new { message = "Falta la Configuración Jwt:Key" });

			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
			var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

			var token = new JwtSecurityToken(
			issuer: _configuration["Jwt:Issuer"],
			audience: null,
			claims: claims,
			expires: DateTime.Now.AddHours(2),
			signingCredentials: creds
			);

			return Ok(new
			{
				token = new JwtSecurityTokenHandler().WriteToken(token)
			});
		}
	}	
}