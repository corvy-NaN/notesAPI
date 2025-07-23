using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using NotesAPI.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace NotesAPI.Controllers
{

	[ApiController]
	[Route("api/[controller]")]
	public class NotesController : ControllerBase
	{
		private readonly NotesDbContext _context;

		public NotesController(NotesDbContext context)
		{
			_context = context;
		}

		[HttpGet("{id}")]
		[Authorize]
		public async Task<ActionResult<Note>> GetNotes(int id)
		{
			int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

			var note = await _context.Notes.FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);

			if (note == null)
			{
				return NotFound(new { message = $"No se encontró la nota numero {id}."}); //404
			}
			return note; //200
		}

		[HttpGet]
		[Authorize]
		public async Task<ActionResult<IEnumerable<Note>>> GetUserNotes()
		{
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

			var notes = await _context.Notes
				.Where(n => n.UserId == userId)
				.ToListAsync();

			return Ok(notes);
        }

        [HttpPost]
		[Authorize]
		public async Task<ActionResult<Note>> CreateNote(Note note)
		{
			if (!ModelState.IsValid) 
			{
				return BadRequest(ModelState); //400
			}

            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            note.UserId = userId;

            _context.Notes.Add(note);
			await _context.SaveChangesAsync();
			return CreatedAtAction(nameof(GetNotes), new { id = note.Id }, note); //201
		}

		[HttpDelete("{id}")]
		[Authorize]
		public async Task<ActionResult> DeleteNote(int id)
		{

            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            var note = await _context.Notes.FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);
			if (note == null)
			{
                return NotFound(new { message = "No se encontró la nota." });
            } //404
			_context.Notes.Remove(note);
			await _context.SaveChangesAsync();
			return NoContent();
		}

		
		[HttpPut("{id}")]
		[Authorize]
		public async Task<ActionResult<Note>> UpdateNote(int id, [FromBody] Note updatedNote)
		{
            if (id != updatedNote.Id)
                return BadRequest("El ID del parámetro no coincide con el ID de la nota.");

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); //400
            }

            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            var existingNote = await _context.Notes.FindAsync(id);
			if (existingNote == null)
				return NotFound("No se encontró la nota");

            existingNote.Title = updatedNote.Title;
			existingNote.Content = updatedNote.Content;

            await _context.SaveChangesAsync();
			return NoContent();
        }
		
	}
}
