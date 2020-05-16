using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using ResourceAuthServer.EFCore.Interfaces;
using ResourceAuthServer.EFCore.Entities;
using ResourceAuthServer.Infrastructure.Enums;
using ResourceAuthServer.Infrastructure.Interfaces;
using ResourceAuthServer.Infrastructure.Models.Users;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ResourceAuthServer.Infrastructure.Hubs
{
    public class NotifyHub : INotifyHub
    {
        private readonly IHubContext<ConnectionHub> dataHub;
        public readonly IMapper mapper;
        
        public NotifyHub(
            IHubContext<ConnectionHub> dataHub,
            IMapper mapper
        )
        {
            this.dataHub = dataHub;
            this.mapper = mapper;
        }

        public async Task NotifyIfConnected<TEntity>(string relatedUserSub, TEntity user, NotifyState state)
            where TEntity : class, IUser
        {
            string connectionId = UserConnections.Connections.GetValueOrDefault(relatedUserSub);

            if (connectionId != null)
            {
                await dataHub.Clients.Client(connectionId)
                    .SendCoreAsync(state.ToString(), new object[] { user.UserName });
            }
        }

        public async Task NotifyOfNewUser(ApplicationUser user, Roles role)
        {
            if (role != Roles.admin)
            {
                string group;
                IUserVM userVM;

                if (role == Roles.doctor)
                {
                    group = UserGroups.PatientsGroup.ToString();
                    userVM = new DoctorVM();
                }
                else
                {
                    group = UserGroups.DoctorsGroup.ToString();
                    userVM = new PatientVM();
                }

                await dataHub.Clients.Groups(group).SendCoreAsync(
                    "OnNewUserAdded",
                    new object[] { mapper.Map(user, userVM) }
                );
            }
        }
    }
}