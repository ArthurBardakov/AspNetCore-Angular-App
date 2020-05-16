using System.ComponentModel.DataAnnotations;
using ResourceAuthServer.Infrastructure.Enums;

namespace ResourceAuthServer.Infrastructure.Models.Users
{
    public class UserFilterParams
    {
        public FilterOptions FilterOption { get; set; }

        [Required(ErrorMessage = "Filter value cannot be null!")]
        public string FilterValue { get; set; }
        private const int maxFetchLength = 15;
        private int fetchLength = 5;
        public int FetchLength
        {
            get { return fetchLength; }
            set { fetchLength = (value > maxFetchLength ? maxFetchLength : value); }
        }
    }
}