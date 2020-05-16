using AspNet.Security.OpenIdConnect.Primitives;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ResourceAuthServer.EFCore;
using ResourceAuthServer.EFCore.Entities;
using System;
using System.Reflection;

namespace ResourceAuthServer.Infrastructure.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddCustomIdentity(this IServiceCollection services)
        {
            services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 6;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;

                options.User.RequireUniqueEmail = false;

                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);

                options.ClaimsIdentity.UserNameClaimType = OpenIdConnectConstants.Claims.Username;
                options.ClaimsIdentity.UserIdClaimType = OpenIdConnectConstants.Claims.Subject;
                options.ClaimsIdentity.RoleClaimType = OpenIdConnectConstants.Claims.Role;
            })
            .AddEntityFrameworkStores<HospitalContext>()
            .AddDefaultTokenProviders();

            return services;
        }

        public static IServiceCollection AddCustomIdentityServer(
            this IServiceCollection services,
            IWebHostEnvironment environment,
            string connStr
        )
        {
            string migrationAssembly = typeof(Startup).GetTypeInfo().Assembly.GetName().Name;

            var builder = services.AddIdentityServer(options =>
            {
                options.Events.RaiseErrorEvents = true;
                options.Events.RaiseInformationEvents = true;
                options.Events.RaiseFailureEvents = true;
                options.Events.RaiseSuccessEvents = true;

                options.Endpoints.EnableTokenRevocationEndpoint = false;
                options.Endpoints.EnableIntrospectionEndpoint = false;
                options.Endpoints.EnableDeviceAuthorizationEndpoint = false;
            })
            .AddConfigurationStore(configDb =>
            {
                configDb.ConfigureDbContext = db => db.UseNpgsql(
                    connStr, sql => sql.MigrationsAssembly(migrationAssembly));
            })
            .AddOperationalStore(operationalDb =>
            {
                operationalDb.ConfigureDbContext = db => db.UseNpgsql(
                    connStr, sql => sql.MigrationsAssembly(migrationAssembly));
            })
            .AddAspNetIdentity<ApplicationUser>()
             // some X509Certificate2 should be added in production
             .AddDeveloperSigningCredential();

            return services;
        }
    }
}