using ResourceAuthServer.Infrastructure.Interfaces;

namespace ResourceAuthServer.Infrastructure.Models.Account
{
    public class ExternalIdentity: ISignInVM
    {
        public string SignInProvider { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool EmailConfirmed { get; set; }
        public string ProviderKey { get; set; }
    }
}