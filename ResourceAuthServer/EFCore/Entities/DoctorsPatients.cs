using ResourceAuthServer.EFCore.Interfaces;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResourceAuthServer.EFCore.Entities
{
    public class DoctorsPatients : IJoinEntity<Patient>, IJoinEntity<Doctor>
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        public string PatientId { get; set; }
        public Patient Patient { get; set; }

        Patient IJoinEntity<Patient>.Navigation
        {
            get => Patient;
            set => Patient = value;
        }

        public string DoctorId { get; set; }
        public Doctor Doctor { get; set; }

        Doctor IJoinEntity<Doctor>.Navigation
        {
            get => Doctor;
            set => Doctor = value;
        }
    }
}