using System;
using System.ComponentModel.DataAnnotations;

namespace ResourceAuthServer.Infrastructure.Models.Users
{
    public class DoctorVM : UserVM
    {
        [StringLength(40, ErrorMessage = "Specialization must be up to 40 symbols!")]
        public string Specialization { get; set; }

        [Range(1, 45, ErrorMessage = "Cannot be less than 1 and more than 45")]
        [Display(Name = "Years of experience")]
        public int? YearsOfExperience { get; set; }
    }
}