using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ResourceAuthServer.EFCore.Extensions;
using ResourceAuthServer.EFCore.Entities;

namespace ResourceAuthServer.EFCore
{
    public class HospitalContext : IdentityDbContext<ApplicationUser>
    {
        public HospitalContext(DbContextOptions<HospitalContext> options) : base(options) { }

        public new DbSet<ApplicationUser> Users { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Doctor> Doctors { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationUser>()
                   .ToTable("Users")
                   .Ignore(u => u.PhoneNumber)
                   .Ignore(u => u.PhoneNumberConfirmed)
                   .Ignore(u => u.TwoFactorEnabled)
                   .Ignore(u => u.Email)
                   .Ignore(u => u.NormalizedEmail);

            builder.Ignore<IdentityRole>();
            builder.Entity<ApplicationRole>().ToTable("Roles");

            builder.Entity<DoctorsPatients>()
                .HasKey(t => t.Id);
            builder.AddIncludeProps<Patient, Doctor, DoctorsPatients>(
                p => p.RelatedUsers, d => d.RelatedUsers
            );

            builder.Entity<DoctorsPatients>()
                .HasOne(pt => pt.Patient)
                .WithMany(p => p.DoctorsPatients)
                .HasForeignKey(p => p.PatientId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<DoctorsPatients>()
                .HasOne(pt => pt.Doctor)
                .WithMany(t => t.DoctorsPatients)
                .HasForeignKey(p => p.DoctorId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}