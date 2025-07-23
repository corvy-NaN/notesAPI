using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Linq;

namespace NotesAPI.Helpers {
    public class ValidateModelAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {
                var errors = context.ModelState
                        .Where(e => e.Value?.Errors.Any() == true)
                        .ToDictionary(
                            e => e.Key,
                            e => e.Value!.Errors.Select(er => er.ErrorMessage).ToArray());
            context.Result = new BadRequestObjectResult(new { errors });
            };
        }
    }
}