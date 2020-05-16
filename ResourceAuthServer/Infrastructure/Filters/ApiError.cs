using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Collections.Generic;
using System.Linq;

namespace ResourceAuthServer.Infrastructure.Filters
{
    public class ApiError
    {
        public string Message { get; set; }
        public string Details { get; set; }
        public List<ValidationError> Errors { get; set; }

        public ApiError(ModelStateDictionary modelState)
        {
            Message = "Validation Failed";
            Errors = modelState.Keys
                    .SelectMany(key => modelState[key].Errors.Select(x => new ValidationError(key, x.ErrorMessage)))
                    .ToList();
        }
    }
}