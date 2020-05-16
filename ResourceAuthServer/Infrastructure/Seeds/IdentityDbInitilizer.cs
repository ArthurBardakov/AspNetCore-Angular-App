using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ResourceAuthServer.EFCore;
using ResourceAuthServer.EFCore.Entities;
using ResourceAuthServer.Infrastructure.Enums;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ResourceAuthServer.Infrastructure.Seeds
{
    public class IdentityDbInitilizer: IHostedService
    {
        private readonly IServiceProvider serviceProvider;
        private static HospitalContext context;
        private string currentPath;

        public IdentityDbInitilizer(IServiceProvider serviceProvider)
        {
            this.serviceProvider = serviceProvider;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            using (var scope = serviceProvider.CreateScope())
            {
                IServiceProvider sp = scope.ServiceProvider;
                var env = sp.GetRequiredService<IWebHostEnvironment>();
                currentPath = env.ContentRootPath;
                context = sp.GetRequiredService<HospitalContext>();
                await context.Database.MigrateAsync();
                await CreateRoles(sp);
                await CreateUsers(sp);
                await context.SaveChangesAsync();
            }
        }

        private async Task CreateRoles(IServiceProvider provider)
        {
            RoleManager<ApplicationRole> roleManager = provider.GetService<RoleManager<ApplicationRole>>();

            if (!roleManager.Roles.Any())
            {
                var roles = new List<ApplicationRole>()
                {
                    new ApplicationRole
                    { Name = Roles.admin.ToString(), Description = "Unlimited access"},
                    new ApplicationRole
                    { Name = Roles.doctor.ToString(), Description = "Permission to create and manage patients"},
                    new ApplicationRole
                    { Name = Roles.patient.ToString(), Description = "Permission to add doctors" }
                };

                foreach (var role in roles) await roleManager.CreateAsync(role);
            }
        }

        private async Task CreateUsers(IServiceProvider provider)
        {
            if (!context.Users.Any())
            {
                UserManager<ApplicationUser> userManager = provider.GetService<UserManager<ApplicationUser>>();
                var admin = new ApplicationUser("admin@gmail.com", "Alex", "Vagner") { LockoutEnabled = false };
                await userManager.CreateAsync(admin, "password");
                await userManager.AddToRoleAsync(admin, Roles.admin.ToString());
                bool isDoctor;

                await foreach (var user in generateTestUsers())
                {
                    await userManager.CreateAsync(user, "testpass12!");
                    isDoctor = user is Doctor;
                    await userManager.AddToRoleAsync(
                        user,
                        isDoctor ? Roles.doctor.ToString() : Roles.patient.ToString()
                    );
                }
            }
        }

        private async IAsyncEnumerable<ApplicationUser> generateTestUsers()
        {
            using (var fs = File.OpenRead(currentPath + "\\test-users.csv"))
            {
                using (var sr = new StreamReader(fs))
                {
                    string line = await sr.ReadLineAsync();
                    string[] userProps;
                    Doctor doctor;
                    string[] specializations = (await loadDoctorSpecializations()).ToArray();
                    Random rand = new Random();

                    for (int i = 0; (line = await sr.ReadLineAsync()) != null; i++)
                    {
                        userProps = line.Split(',');

                        if (i % 2 == 0)
                        {
                            yield return createUser<Patient>(userProps, rand);
                        }
                        else
                        {
                            doctor = (Doctor)createUser<Doctor>(userProps, rand);
                            doctor.YearsOfExperience = rand.Next(2, 40);
                            doctor.Specialization = specializations[rand.Next(0, specializations.Length - 1)];
                            yield return doctor;
                        }
                    }
                }
            }
        }

        private async Task<IEnumerable<string>> loadDoctorSpecializations()
        {
            using (var fs = File.OpenRead(currentPath + "\\doctor-specializations.json"))
            {
                using (var sr = new StreamReader(fs))
                {
                    var jsonStr = await sr.ReadToEndAsync();
                    return JsonConvert.DeserializeObject<JToken>(jsonStr)
                                ["specializations"].Values<string>();
                }
            }
        }

        private TUser createUser<TUser>(
            string[] userProps,
            Random rand
        ) where TUser: ApplicationUser
        {
            TUser user = (TUser)Activator.CreateInstance(
                typeof(TUser),
                userProps[0],
                userProps[1],
                userProps[2]
            );
            user.Age = rand.Next(25, 65);
            user.EmailConfirmed = false;
            user.LockoutEnabled = true;

            return user;
        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    }
}