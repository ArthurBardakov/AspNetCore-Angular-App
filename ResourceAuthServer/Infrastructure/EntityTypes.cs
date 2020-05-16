using ResourceAuthServer.Controllers;
using ResourceAuthServer.EFCore.Entities;
using ResourceAuthServer.Infrastructure.Enums;
using ResourceAuthServer.Infrastructure.Models.Users;
using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Reflection;

namespace ResourceAuthServer.Infrastructure
{
    public static class EntityTypes
    {
        public static readonly ImmutableDictionary<GenericControllers, Type> ControllerTypes;
        public static readonly ImmutableDictionary<GenericControllers, ImmutableArray<TypeInfo>> TypeArguments;

        private static ImmutableArray<TypeInfo> patientTypes => ImmutableArray.Create
        (
            typeof(Doctor).GetTypeInfo(),
            typeof(Patient).GetTypeInfo(),
            typeof(PatientVM).GetTypeInfo()
        );

        private static ImmutableArray<TypeInfo> doctorTypes => ImmutableArray.Create
        (
            typeof(Patient).GetTypeInfo(),
            typeof(Doctor).GetTypeInfo(),
            typeof(DoctorVM).GetTypeInfo()
        );

        public static ImmutableArray<TypeInfo> PatientProfileTypes => ImmutableArray.Create
        (
            typeof(Patient).GetTypeInfo(),
            typeof(PatientVM).GetTypeInfo()
        );

        public static ImmutableArray<TypeInfo> DoctorProfileTypes => ImmutableArray.Create
        (
            typeof(Doctor).GetTypeInfo(),
            typeof(DoctorVM).GetTypeInfo()
        );

        static EntityTypes()
        {
            ControllerTypes = new Dictionary<GenericControllers, Type>()
            {
                {GenericControllers.Patients, typeof(UsersController<,,>)},
                {GenericControllers.Doctors, typeof(UsersController<,,>)},
                {GenericControllers.PatientProfile, typeof(ProfileController<,>)},
                {GenericControllers.DoctorProfile, typeof(ProfileController<,>)}
            }.ToImmutableDictionary();

            TypeArguments = new Dictionary<GenericControllers, ImmutableArray<TypeInfo>>()
            {
                {GenericControllers.Patients, patientTypes},
                {GenericControllers.Doctors, doctorTypes},
                {GenericControllers.PatientProfile, PatientProfileTypes},
                {GenericControllers.DoctorProfile, DoctorProfileTypes}
            }.ToImmutableDictionary();
        }
    }
}
