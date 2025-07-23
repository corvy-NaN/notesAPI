using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using NotesAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;


namespace NotesAPI.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class UsersController : ControllerBase
	{
		private readonly NotesDbContext _context;

		public UsersController(NotesDbContext context)
		{
			_context = context;
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<User>>> GetUsers()
		{
			return await _context.Users.ToListAsync();
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<User>> GetUser(int id)
		{
			var user = await _context.Users.FindAsync(id);

			if (user == null)
				return NotFound(new { message = "Usuario no encontrado" });

			return user;
		}

        [HttpGet("{id}/notes")]
		public async Task<ActionResult<IEnumerable<Note>>> GetUserNotes(int id)
		{
			var user = await _context.Users
				.Include(u => u.Notes)
				.FirstOrDefaultAsync(u => u.Id == id);

			if (user == null)
				return NotFound(new { message = "Usuario no encontrado" });

			return Ok(user.Notes);
		}
		/*
		[HttpGet("user/{userId}")]
		[Authorize]
		public async Task<ActionResult<IEnumerable<Note>>> GetNotesByUserId(int userId)
		{
			var notes = await _context.Notes
				.Where(n => n.UserId == userId)
				.ToListAsync();

			if (notes.Count == 0)
			{
				return NotFound(new { message = $"No se encontraron notas del usuario {userId}" });
			}
			return Ok(notes);
		}*/

		[HttpPut("{id}")]
		public async Task<IActionResult> PutUser(int id, User updatedUser)
		{
			if (id != updatedUser.Id)
				return BadRequest(new { message = "El ID no coincide" });

			_context.Entry(updatedUser).State = EntityState.Modified;

			try
			{
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!_context.Users.Any(e => e.Id == id))
					return NotFound(new { message = "Usuario no encontrado" });

				throw;
			}
			return NoContent();
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteUser(int id)
		{
			var user = await _context.Users.FindAsync(id);
			if (user == null)
				return NotFound(new { message = "Usuario no encontrado" });

			_context.Users.Remove(user);
			await _context.SaveChangesAsync();

			return Ok(new { message = "Usuario Eliminado" });
		}

		[HttpPost]
		public async Task<ActionResult<User>> CreateUser(User newUser)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);

			_context.Users.Add(newUser);
			await _context.SaveChangesAsync();

			return CreatedAtAction(nameof(GetUser), new { id = newUser.Id }, newUser);
		}

		[HttpGet("perfil")]
		[Authorize]
		public ActionResult<UserProfileDto> GetProfile()
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

			if (userId == null)
				return Unauthorized();

			var user = _context.Users.Find(int.Parse(userId));

			if (user == null)
				return NotFound();

			var perfilDto = new UserProfileDto
			{
				Email = user.Email,
				Nombre = user.Username
			};
			return Ok(perfilDto);
		}
	}
}
