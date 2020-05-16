using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResourceAuthServer.EFCore.Entities
{
    public class Prescription
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        [StringLength(250, MinimumLength = 4)]
        public string Diagnosis { get; set; }

        public DateTime VisitDate { get; private set; }

        [StringLength(1000, MinimumLength = 20)]
        public string Description { get; set; }

        public Prescription()
        {
            VisitDate = DateTime.Now;
        }
    }
}