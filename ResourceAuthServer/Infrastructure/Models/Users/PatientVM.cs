using System;
using System.ComponentModel.DataAnnotations;

namespace ResourceAuthServer.Infrastructure.Models.Users
{
    public class PatientVM : UserVM
    {
        [Display(Name = "Registry date")]
        public DateTime RegistryDate { get; set; }
    }
}