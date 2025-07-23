using System.ComponentModel.DataAnnotations;


namespace NotesAPI.Helpers
{
	public class NoBadWordsAttribute : ValidationAttribute
	{
		private readonly List<string> _badWords = new()
	{
		"spoilers", "idiota", "idiot", "baka"
	};
		protected override ValidationResult IsValid(object? value, ValidationContext validationContext)
		{
			if (value == null) 
			{
				return ValidationResult.Success!;
			}

			string? stringValue = value as string;
			if (stringValue != null) 
			{
				foreach (var badWord in _badWords)
				{
					if (stringValue.Contains(badWord, StringComparison.OrdinalIgnoreCase))
					{
						return new ValidationResult($"Contains bad word: {badWord}");
					}
				}
			}
			
			return ValidationResult.Success!;
		}
	}
}