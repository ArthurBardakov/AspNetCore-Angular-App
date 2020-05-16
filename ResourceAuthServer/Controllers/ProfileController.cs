using AspNet.Security.OpenIdConnect.Extensions;
using AspNet.Security.OpenIdConnect.Primitives;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using ResourceAuthServer.EFCore.Interfaces;
using ResourceAuthServer.Infrastructure;
using System.Threading.Tasks;

namespace ResourceAuthServer.Controllers
{
    [GenericControllerNameConvention]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "resourceapi")]
    public class ProfileController<TEntity, TView> : ControllerBase
        where TEntity : class, IUser
        where TView : class, new()
    {
        private readonly IUnitOfWork uw;
        private readonly IMapper mapper;

        public ProfileController(
            IUnitOfWork uw,
            IMapper mapper
        )
        {
            this.uw = uw;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<TView> Get()
        {
            TEntity user = await getCurrentUser();
            return mapper.Map<TView>(user);
        }

        [HttpPatch]
        public async Task<ActionResult> Edit(
            [FromBody]JsonPatchDocument<TView> patchDocument)
        {
            if (patchDocument != null)
            {
                if (patchDocument.Operations.Count != 0)
                {
                    TEntity user = await getCurrentUser();
                    TView userVM = mapper.Map<TView>(user);
                    patchDocument.ApplyTo(userVM, ModelState);

                    if (!TryValidateModel(userVM))
                        return ValidationProblem(ModelState);

                    uw.Repository<TEntity>().Update(mapper.Map(userVM, user));
                    await uw.Save();
                }
                return NoContent();
            }

            return BadRequest(ModelState);
        }

        private Task<TEntity> getCurrentUser()
        {
            string sub = User.GetClaim(OpenIdConnectConstants.Claims.Subject);
            return uw.Repository<TEntity>().GetAsync(u => u.Id == sub);
        }
    }
}