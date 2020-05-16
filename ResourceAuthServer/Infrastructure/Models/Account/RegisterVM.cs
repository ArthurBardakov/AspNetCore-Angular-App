using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using ResourceAuthServer.Infrastructure.Enums;
using System.Linq;
using ResourceAuthServer.Infrastructure.Interfaces;

namespace ResourceAuthServer.Infrastructure.Models.Account
{
    public class RegisterVM: IValidatableObject, ISignInVM
    {
        [Required(ErrorMessage = "Last name field is required!")]
        [StringLength(25, ErrorMessage = "Last name length must be between 2 and 25 symbols!", MinimumLength = 2)]
        [Display(Name = "Last name")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "First name field is required!")]
        [StringLength(20, ErrorMessage = "First name length must be between 2 and 20 symbols!", MinimumLength = 2)]
        [Display(Name = "First name")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "The email field is required!")]
        [EmailAddress(ErrorMessage = "Invalid email field!")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password field is required!")]
        [StringLength(25, ErrorMessage = "Password length must be between 6 and 25 symbols!", MinimumLength = 6)]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Required(ErrorMessage = "Confirm password field is required!")]
        [StringLength(25, ErrorMessage = "Confirm password field length must be between 6 and 25 symbols!", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Compare(nameof(Password), ErrorMessage = "Confirm password and password fields do not match!")]
        public string ConfirmPassword { get; set; }

        [Required(ErrorMessage = "Role field is required!")]
        public string Role { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var registerVM = (RegisterVM)validationContext.ObjectInstance;
            bool isRoleValid = typeof(Roles).GetEnumNames().Any(n => n == registerVM.Role.ToLower());
            if (!isRoleValid)
            {
                yield return new ValidationResult(
                    "Ivalid user role provided!",
                    new[] { nameof(RegisterVM) }
                );
            }

            yield return ValidationResult.Success;
        }
    }
}