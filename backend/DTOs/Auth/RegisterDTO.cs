using System;
using System.ComponentModel.DataAnnotations;

namespace NotesAPI.DTOs.Auth
{
	public class RegisterDto
	{
		[Required(ErrorMessage ="Nombre de Usuario Necesario")]
		[MinLength(4, ErrorMessage = "Nombre de Usuario debe tener mas de 4 letras")]
		public string Username { get; set; } = default!;

        [Required(ErrorMessage = "Contraseña Necesario")]
		[MinLength(6, ErrorMessage = "Contraseña debe tener mas de 6 Caracteres")]
        public string Password { get; set; } = default!;
    }
}
