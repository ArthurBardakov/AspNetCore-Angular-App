using AspNet.Security.OpenIdConnect.Extensions;
using AspNet.Security.OpenIdConnect.Primitives;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResourceAuthServer.EFCore.Interfaces;
using ResourceAuthServer.EFCore.Entities;
using ResourceAuthServer.Infrastructure.Enums;
using ResourceAuthServer.Infrastructure.Filters;
using ResourceAuthServer.Infrastructure.Models.Prescriptions;
using ResourceAuthServer.Infrastructure.Models.Users;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ResourceAuthServer.Controllers
{
    [Route("api/doctor/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "doctor")]
    public class PrescriptionController: ControllerBase
    {
        private readonly IUnitOfWork uw;
        private readonly IMapper mapper;

        public PrescriptionController(
            IUnitOfWork uw,
            IMapper mapper
        )
        {
            this.uw = uw;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery]EmailVM emailVM)
        {
            var doctor = await getCurrentUser();
            var patient = (Patient)doctor.RelatedUsers.FirstOrDefault(u => u.UserName == emailVM.Email);

            if (patient != null)
            {
                patient = await uw.Repository<Patient>()
                    .GetAsync(p => p.UserName == patient.UserName, p => p.Prescriptions);
                var prescVMs = mapper.Map<IEnumerable<PrescriptionVM>>(patient.Prescriptions);
                return Ok(prescVMs);
            }
            return NotFound(new ValidationError(
                ErrorType.UnexpectedError,
                "There is no such a patient to retrieve data!"
            ));
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody]AddPrescriptionVM prescVM)
        {
            var doctor = await getCurrentUser();
            var patient = (Patient)doctor.RelatedUsers.FirstOrDefault(u => u.UserName == prescVM.Email);

            if (patient != null)
            {
                patient = await uw.Repository<Patient>()
                    .GetAsync(p => p.UserName == patient.UserName, p => p.Prescriptions);
                patient.Prescriptions.Add(new Prescription()
                {
                    Diagnosis = prescVM.Diagnosis,
                    Description = prescVM.Description
                });
                await uw.Save();
                return Ok();
            }
            return NotFound(new ValidationError(
                ErrorType.UnexpectedError,
                "There is no such a patient to add data!"
            ));
        }

        private Task<Doctor> getCurrentUser()
        {
            string sub = User.GetClaim(OpenIdConnectConstants.Claims.Subject);
            return uw.Repository<Doctor>().GetAsync(u => u.Id == sub, u => u.RelatedUsers);
        }
    }
}