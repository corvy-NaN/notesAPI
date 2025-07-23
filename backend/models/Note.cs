using System;
using NotesAPI.Helpers;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NotesAPI.Models
{

    public class Note
    {
        public int Id { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        

        [Required(ErrorMessage ="Titulo Necesario")]
        [MaxLength(100, ErrorMessage ="El titulo Debe ser mas Corto")]
        [NoBadWords]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage ="Contenido Necesario")]
        [MinLength(5, ErrorMessage ="El Contenido Debe ser mas Largo")]
        [NoBadWords]
        public string Content { get; set; } = string.Empty;

        [ForeignKey("User")]
        public int UserId { get; set; }
        public User? User { get; set; }
    }
}