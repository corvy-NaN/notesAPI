﻿using Microsoft.EntityFrameworkCore;
using NoteAPI.models;

namespace NoteAPI.models
{

	public class NotesDbContext : DbContext
	{
		public NotesDbContext(DbContextOptions<NotesDbContext> options)
			: base(options) { }

		public DbSet<Note> Notes { get; set; }
	}
}