using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using NoteAPI.models;

namespace NoteAPI.controllers
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
		public async Task<ActionResult<Note>> GetNotes(int id)
		{
			var note = await _context.Notes.FindAsync(id);

			if (note == null)
			{
				return NotFound();
			}
			return note;
		}

		[HttpPost]
		public async Task<ActionResult<Note>> CreateNote(Note note)
		{
			_context.Notes.Add(note);
			await _context.SaveChangesAsync();
			return CreatedAtAction(nameof(GetNotes), new { id = note.Id }, note);
		}

		[HttpDelete("{id}")]
		public async Task<ActionResult> DeleteNote(int id)
		{
			var note = await _context.Notes.FindAsync(id);
			if (note == null)
			{
				return NotFound();
			}
			_context.Notes.Remove(note);
			await _context.SaveChangesAsync();
			return NoContent();
		}
	}
}
