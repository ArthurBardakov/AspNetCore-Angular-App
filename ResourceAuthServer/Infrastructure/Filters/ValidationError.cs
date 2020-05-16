using Newtonsoft.Json;
using ResourceAuthServer.Infrastructure.Enums;

namespace ResourceAuthServer.Infrastructure.Filters
{
    public class ValidationError
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Field { get; }

        public string Message { get; }

        public ValidationError(string field, string message)
        {
            Field = field != string.Empty ? field : null;
            Message = message;
        }

        public ValidationError(ErrorType errorType, string message)
        {
            Field = errorType.ToString();
            Message = message;
        }
    }
}