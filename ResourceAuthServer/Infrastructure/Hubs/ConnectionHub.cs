using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Linq;
using System.Threading.Tasks;

namespace ResourceAuthServer.Infrastructure.Hubs
{

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ConnectionHub : Hub
    {
        public async Task OnConnectedAsync(string group)
        {
            string sub = Context.User.Claims.First(c => c.Type == "sub").Value;
            UserConnections.Connections.TryAdd(sub, Context.ConnectionId);
            await Groups.AddToGroupAsync(Context.ConnectionId, group);
        }

        public async Task OnDisconnectedAsync(string group)
        {
            string sub = Context.User.Claims.First(c => c.Type == "sub").Value;
            UserConnections.Connections.TryRemove(sub, out string removeResult);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, group);
        }
    }
}