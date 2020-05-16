using System.Collections.Concurrent;
using System.Collections.Generic;

namespace ResourceAuthServer.Infrastructure.Hubs
{
    public static class UserConnections
    {
        public static ConcurrentDictionary<string, string> Connections =
            new ConcurrentDictionary<string, string>();
    }
}