using ResourceAuthServer.EFCore.Interfaces;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResourceAuthServer.EFCore.Entities
{
    public class Patient : ApplicationUser, IUser
    {
        [NotMapped]
        public ICollection<IUser> RelatedUsers { get; }

        public ICollection<Prescription> Prescriptions { get; set; }

        public Patient()
        {
            RelatedUsers = new JoinCollection<Patient, Doctor, DoctorsPatients>(this, DoctorsPatients);
        }

        public Patient(string userName, string firstName, string lastName) :
            base(userName, firstName, lastName) { }
    }
}