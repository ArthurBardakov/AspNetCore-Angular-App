using AspNet.Security.OpenIdConnect.Primitives;
using IdentityServer4;
using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Mappers;
using IdentityServer4.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ResourceAuthServer.Infrastructure.Seeds
{
    public class IdentityServerDbInitilizer: IHostedService
    {
        private readonly IServiceProvider serviceProvider;
        private readonly IWebHostEnvironment env;
        private readonly IConfiguration config;

        public IdentityServerDbInitilizer(
            IServiceProvider serviceProvider,
            IWebHostEnvironment env,
            IConfiguration config)
        {
            this.serviceProvider = serviceProvider;
            this.env = env;
            this.config = config;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            using (var serviceScope = serviceProvider.CreateScope())
            {
                IServiceProvider sp = serviceScope.ServiceProvider;
                await sp.GetRequiredService<PersistedGrantDbContext>().Database.MigrateAsync();
                ConfigurationDbContext configContext = sp.GetRequiredService<ConfigurationDbContext>();
                await configContext.Database.MigrateAsync();
                AddClients(configContext);
                AddIdentityResources(configContext);
                AddApiResources(configContext);
                await configContext.SaveChangesAsync();
            }
        }

        private void AddClients(
            ConfigurationDbContext configContext
        )
        {
            if (!configContext.Clients.Any())
            {
                IConfigurationSection type = (env.EnvironmentName == "ClientRemote" ||
                                              env.EnvironmentName == "ClientServer") ?
                                              config.GetSection("Type:Development") :
                                              config.GetSection("Type:Production");

                string[] clientsUris = type.GetSection("ClientsUris")
                       .GetChildren().Select(v => v.Value).ToArray();
                string[] clientsIds = type.GetSection("ClientIds")
                    .GetChildren().Select(v => v.Value).ToArray();

                for (int i = 0; i < clientsUris.Length; i++)
                {
                    configContext.Clients.Add(
                        new Client
                        {
                            ClientId = clientsIds[i],
                            ClientName = "NovaClinic",
                            ClientUri = clientsUris[i],

                            AllowedGrantTypes = GrantTypes.Code.Concat(
                                GrantTypes.ResourceOwnerPassword).ToList(),
                            RequirePkce = true,
                            AllowPlainTextPkce = false,
                            RequireClientSecret = false,
                            RequireConsent = false,
                            AllowOfflineAccess = true,
                            AlwaysIncludeUserClaimsInIdToken = true,
                            AllowAccessTokensViaBrowser = true,
                            RefreshTokenExpiration = TokenExpiration.Absolute,
                            RefreshTokenUsage = TokenUsage.ReUse,
                            AccessTokenLifetime = 60,
                            IdentityTokenLifetime = 60,
                            AbsoluteRefreshTokenLifetime = 86400,
                            AuthorizationCodeLifetime = 60,

                            RedirectUris = { clientsUris[i] + "/(body:authorize-callback)" },
                            PostLogoutRedirectUris = { clientsUris[i] },
                            AllowedCorsOrigins = { clientsUris[i] },

                            AllowedScopes = new List<string>
                            {
                                IdentityServerConstants.StandardScopes.OpenId,
                                IdentityServerConstants.StandardScopes.Profile,
                                IdentityServerConstants.StandardScopes.OfflineAccess,
                                "role",
                                "resourceapi"
                            }
                        }
                        .ToEntity()
                    );
                }
            }
        }

        private void AddIdentityResources(ConfigurationDbContext configContext)
        {
            if (!configContext.IdentityResources.Any())
            {
                configContext.IdentityResources.AddRange(
                    new IdentityResource[]
                    {
                        new IdentityResources.OpenId(),
                        new IdentityResources.Profile(),
                        new IdentityResource(
                            name: "role",
                            displayName: "User Role",
                            claimTypes: new[] { OpenIdConnectConstants.Claims.Role }
                        )
                    }
                    .Select(en => en.ToEntity())
                );
            }
        }

        private void AddApiResources(ConfigurationDbContext configContext)
        {
            if (!configContext.ApiResources.Any())
            {
                configContext.ApiResources.Add(
                    new ApiResource(
                        "resourceapi",
                        "Resource API",
                        new[] { OpenIdConnectConstants.Claims.Role }
                    ).ToEntity()
                );
            }
        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    }
}