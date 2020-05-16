using AspNet.Security.OpenIdConnect.Primitives;
using AutoMapper;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.ApplicationParts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Microsoft.IdentityModel.Logging;
using ResourceAuthServer.EFCore;
using ResourceAuthServer.EFCore.Interfaces;
using ResourceAuthServer.Infrastructure;
using ResourceAuthServer.Infrastructure.Enums;
using ResourceAuthServer.Infrastructure.Extensions;
using ResourceAuthServer.Infrastructure.Hubs;
using ResourceAuthServer.Infrastructure.Interfaces;
using ResourceAuthServer.Infrastructure.Seeds;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Threading.Tasks;

[assembly: Microsoft.AspNetCore.Mvc.ApiController]
namespace ResourceAuthServer
{
    public class Startup
    {
        public static IConfiguration Configuration { get; private set; }
        private readonly IWebHostEnvironment env;
        public static FirebaseApp FirebaseApp { get; private set; }
        private readonly string clientCorsPolicy;

        public Startup(IWebHostEnvironment env)
        {
            this.env = env;
            if (env.IsEnvironment("ClientRemote"))
            {
                clientCorsPolicy = "AllowLocalhost4200";
            }

            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", 
                            optional: false, 
                            reloadOnChange: true)
                .AddEnvironmentVariables();

            if (!env.IsProduction())
            {
                builder.AddUserSecrets<Startup>();
            }

            Configuration = builder.Build();

            FirebaseApp = FirebaseApp.Create(new AppOptions()
            {
                Credential = GoogleCredential.FromFile(env.ContentRootPath + "\\novaclinic-38220-0df8a74b6eed.json"),
            });
        }

        public void ConfigureServices(IServiceCollection services)
        {
            string connStr = Configuration.GetConnectionString("DefaultConnection");
            string clientUri = Environment.GetEnvironmentVariable("CLIENT_URL");
            string serverUrl = Environment.GetEnvironmentVariable("SERVER_URL");

            if (env.IsEnvironment("ClientRemote"))
            {
                services.AddCors(options => options.AddPolicy(clientCorsPolicy, builder =>
                {
                    builder
                    .WithOrigins(clientUri)
                    .WithHeaders("Accept, Content-Type, Origin, X-Requested-With, Authorization, Access-Control-Request-Headers")
                    .WithExposedHeaders("X-Pagination")
                    .WithMethods("GET, POST, PATCH, DELETE, OPTIONS")
                    .AllowCredentials(); // for hub connection
                }));
            }

            services.AddEntityFrameworkNpgsql().AddDbContextPool<HospitalContext>(options =>
                options.UseNpgsql(connStr)
            );
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddSingleton<INotifyHub, NotifyHub>();
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            services.AddCustomIdentity();
            services.AddCustomIdentityServer(env, connStr);

            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
            JwtSecurityTokenHandler.DefaultOutboundClaimTypeMap.Clear();
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, o =>
            {
                o.Authority = serverUrl + '/';
                o.Audience = "resourceapi";
                o.RequireHttpsMetadata = false;
                o.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        if (context.Request.Path.Value.StartsWith("/connectionHub") &&
                            context.Request.Query.TryGetValue("access_token", out StringValues token)
                        )
                        {
                            context.Token = token;
                        }

                        return Task.CompletedTask;
                    }
                };
            });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("resourceapi",
                    policy => policy.RequireClaim(
                        OpenIdConnectConstants.Claims.Scope, "resourceapi"
                    ));
                options.AddPolicy(Roles.doctor.ToString(),
                    policy => policy.RequireClaim(
                        OpenIdConnectConstants.Claims.Role, Roles.doctor.ToString()
                    ));
            });

            services.AddHostedService<IdentityDbInitilizer>();
            services.AddHostedService<IdentityServerDbInitilizer>();

            services.AddSignalR();
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "wwwroot";
            });

            AssemblyPart part = new AssemblyPart(typeof(Startup).GetTypeInfo().Assembly);
            services.AddMvc().ConfigureApplicationPartManager(apm =>
            {
                apm.ApplicationParts.Add(part);
                apm.FeatureProviders.Add(new GenericControllerFeatureProvider());
            });
            services.AddControllers()
                    .AddNewtonsoftJson();
        }

        public void Configure(IApplicationBuilder app, ILogger<Startup> logger)
        {
            if (env.IsEnvironment("ClientRemote"))
            {
                app.UseCors(clientCorsPolicy);
            }

            if (!env.IsProduction())
            {
                IdentityModelEventSource.ShowPII = true;
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.ConfigureExceptionHandler(logger);
            app.UseFileServer();
            app.UseHttpsRedirection();
            app.UseRouting();
            // UseIdentityServer includes a call to UseAuthentication, so it’s not necessary to have both.
            app.UseIdentityServer();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ConnectionHub>("/connectionHub");
            });
            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "wwwroot";
            });
        }
    }
}
