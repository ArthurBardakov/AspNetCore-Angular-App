namespace ResourceAuthServer.Infrastructure.Interfaces
{
    public interface ISignInVM
    {
        string LastName { get; set; }
        string FirstName { get; set; }
        string Email { get; set; }
    }
}