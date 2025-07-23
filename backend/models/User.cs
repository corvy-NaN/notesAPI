using System.ComponentModel.DataAnnotations;
namespace NotesAPI.Models
{
	public class User
	{
		public int Id { get; set; }

		[Required]
		[MaxLength(50)]
		public string Username { get; set; } = string.Empty;

		[Required]
		[EmailAddress]
		public string Email { get; set; } = string.Empty;

		[Required]
		public string PasswordHash { get; set; } = string.Empty;

		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

		public ICollection<Note> Notes { get; set; } = new List<Note>();
	}
}
