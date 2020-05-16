using System.Collections.Generic;

namespace ResourceAuthServer.EFCore.Interfaces
{
    public interface IUser
    {
        string Id { get; set; }
        string UserName { get; set; }
        ICollection<IUser> RelatedUsers { get; }
    }
}