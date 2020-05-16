using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ResourceAuthServer.EFCore.Entities
{
    public class ApplicationUser : IdentityUser
    {
        [Required]
        [StringLength(25, MinimumLength = 2)]
        public string LastName { get; set; }

        [Required]
        [StringLength(20, MinimumLength = 2)]
        public string FirstName { get; set; }

        [Range(18, 100)]
        public int? Age { get; set; }
        public DateTime RegistryDate { get; private set; }

        internal ICollection<DoctorsPatients> DoctorsPatients { get; set; } = new List<DoctorsPatients>();
        
        public ApplicationUser() { }

        public ApplicationUser(string username, string firstName, string lastName)
        {
            UserName = username;
            FirstName = firstName;
            LastName = lastName;
            RegistryDate = DateTime.Now;
        }
    }
}