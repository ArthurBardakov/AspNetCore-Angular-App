using System;
using FirebaseAdmin.Auth;
using Newtonsoft.Json.Linq;
using ResourceAuthServer.Infrastructure.Models.Account;

namespace ResourceAuthServer.Infrastructure.Extensions
{
    public static class FirebaseTokenResponseExtensions
    {
        public static ExternalIdentity CreateIdentity(this FirebaseToken payload)
        {
            if (payload == null)
            {
                throw new ArgumentNullException(nameof(FirebaseToken));
            }

            var claims = payload.Claims;
            var nameParts = (payload.Claims["name"] as string).Split(' ');

            var identity = new ExternalIdentity()
            {
                FirstName = nameParts[0],
                LastName = nameParts[1],
                ProviderKey = payload.Subject,
                Email = claims["email"] as string,
                EmailConfirmed = (bool)claims["email_verified"],
                SignInProvider = (claims["firebase"] as JToken)["sign_in_provider"].Value<string>()
            };

            return identity;
        }
    }
}