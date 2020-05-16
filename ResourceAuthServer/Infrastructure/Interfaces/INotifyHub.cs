using ResourceAuthServer.EFCore.Interfaces;
using ResourceAuthServer.EFCore.Entities;
using ResourceAuthServer.Infrastructure.Enums;
using System.Threading.Tasks;

namespace ResourceAuthServer.Infrastructure.Interfaces
{
    public interface INotifyHub
    {
        Task NotifyIfConnected<TEntity>(
            string relatedUserSub,
            TEntity user,
            NotifyState state
        ) where TEntity : class, IUser;

        Task NotifyOfNewUser(ApplicationUser user, Roles role);
    }
}