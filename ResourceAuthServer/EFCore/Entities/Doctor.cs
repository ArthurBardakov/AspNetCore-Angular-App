using ResourceAuthServer.EFCore.Interfaces;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResourceAuthServer.EFCore.Entities
{
    public class Doctor : ApplicationUser, IUser
    {
        [StringLength(40)]
        public string Specialization { get; set; }

        [Range(1, 45)]
        public int? YearsOfExperience { get; set; }

        [NotMapped]
        public ICollection<IUser> RelatedUsers { get; }

        public Doctor()
        {
            RelatedUsers = new JoinCollection<Doctor, Patient, DoctorsPatients>(this, DoctorsPatients);
        }

        public Doctor(string userName, string firstName, string lastName) :
            base(userName, firstName, lastName) { }
    }
}