using System;
using System.ComponentModel.DataAnnotations;

namespace ResourceAuthServer.Infrastructure.Models.Prescriptions
{
    public class PrescriptionVM
    {
        public string Diagnosis { get; set; }

        public DateTime VisitDate { get; private set; }

        [StringLength(1000)]
        public string Description { get; set; }
    }
}