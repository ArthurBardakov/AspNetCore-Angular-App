using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace ResourceAuthServer.EFCore.Entities
{
    public class ApplicationRole : IdentityRole
    {
        [StringLength(250)]
        public string Description { get; set; }
    }
}