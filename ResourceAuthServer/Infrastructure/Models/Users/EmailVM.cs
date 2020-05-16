using System.ComponentModel.DataAnnotations;

namespace ResourceAuthServer.Infrastructure.Models.Users
{
    public class EmailVM
    {
        [Required(ErrorMessage = "The email field is required.")]
        [EmailAddress(ErrorMessage = "Invalid email field.")]
        public string Email { get; set; }
    }
}
