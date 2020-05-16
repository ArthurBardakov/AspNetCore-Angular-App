using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Net;

namespace ResourceAuthServer.Infrastructure.Extensions
{
    public static class ApplicationBuilderExtensions
    {
        public static void ConfigureExceptionHandler(this IApplicationBuilder app, ILogger logger)
        {
            app.UseExceptionHandler(appError =>
            {
                appError.Run(async context =>
                {
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    context.Response.ContentType = "application/json";

                    var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
                    if (contextFeature != null)
                    {
                        logger.LogError($"Something went wrong: {contextFeature.Error}");
                        string text = JsonConvert.SerializeObject(
                            new
                            {
                                StatusCode = context.Response.StatusCode,
                                Message = "Internal Server Error. Try again later."
                            });
                        await context.Response.WriteAsync(text);
                    }
                });
            });
        }
    }
}
