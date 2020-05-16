using System.ComponentModel.DataAnnotations;

namespace ResourceAuthServer.Infrastructure.Models.Account
{
    public class LoginVM
    {
        [Required(ErrorMessage = "The email field is required!")]
        [EmailAddress(ErrorMessage = "Invalid email field")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password field is required!")]
        [DataType(DataType.Password)]
        [StringLength(25, ErrorMessage = "Password must be between 6 and 25 characters!", MinimumLength = 6)]
        public string Password { get; set; }
    }
}