using AutoMapper;
using ResourceAuthServer.EFCore;
using ResourceAuthServer.EFCore.Entities;
using ResourceAuthServer.Infrastructure.Models;
using ResourceAuthServer.Infrastructure.Models.Prescriptions;

namespace ResourceAuthServer.Infrastructure.Profiles
{
    public class UsersProfile: Profile
    {
        public UsersProfile()
        {
            CreateMap(
                EntityTypes.PatientProfileTypes[0],
                EntityTypes.PatientProfileTypes[1]
            ).ReverseMap();
            CreateMap(
                EntityTypes.DoctorProfileTypes[0],
                EntityTypes.DoctorProfileTypes[1]
            ).ReverseMap();
            CreateMap<Prescription, PrescriptionVM>();
            CreateMap<PagedList<Doctor>, PagingMetadata>();
            CreateMap<PagedList<Patient>, PagingMetadata>();
        }
    }
}