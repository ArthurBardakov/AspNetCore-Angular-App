using System.ComponentModel.DataAnnotations;
using ResourceAuthServer.Infrastructure.Models.Users;

namespace ResourceAuthServer.Infrastructure.Models.Prescriptions
{
    public class AddPrescriptionVM : EmailVM
    {
        [StringLength(250, MinimumLength = 4, ErrorMessage = "Diagnosis must be between 4 and 250 symbols!")]
        public string Diagnosis { get; set; }

        [StringLength(1000, MinimumLength = 20, ErrorMessage = "Description must be between 20 and 1000 symbols!")]
        public string Description { get; set; }
    }
}