using ResourceAuthServer.Infrastructure.Interfaces;
using System;
using System.ComponentModel.DataAnnotations;

namespace ResourceAuthServer.Infrastructure.Models.Users
{
    public class UserVM : IUserVM
    {
        [Required(ErrorMessage = "Last name field is required!")]
        [StringLength(25, ErrorMessage = "Last name length must be between 2 and 25 symbols!", MinimumLength = 2)]
        [Display(Name = "Last name")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "First name field is required!")]
        [StringLength(20, ErrorMessage = "First name length must be between 2 and 20 symbols!", MinimumLength = 2)]
        [Display(Name = "First name")]
        public string FirstName { get; set; }

        [Range(18, 100, ErrorMessage = "Age must be between 18 and 100!")]
        public int? Age { get; set; }

        [Required(ErrorMessage = "The username field is required!")]
        [EmailAddress(ErrorMessage = "Invalid username field")]
        [Display(Name = "User name")]
        public string UserName { get; set; }
    }
}