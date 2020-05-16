using AspNet.Security.OpenIdConnect.Extensions;
using AspNet.Security.OpenIdConnect.Primitives;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ResourceAuthServer.EFCore.Interfaces;
using ResourceAuthServer.Infrastructure;
using ResourceAuthServer.Infrastructure.Enums;
using ResourceAuthServer.Infrastructure.Filters;
using ResourceAuthServer.Infrastructure.Helpers;
using ResourceAuthServer.Infrastructure.Interfaces;
using ResourceAuthServer.Infrastructure.Models;
using ResourceAuthServer.Infrastructure.Models.Users;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace ResourceAuthServer.Controllers
{
    [GenericControllerNameConvention]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "resourceapi")]
    public class UsersController<TEntity, TOtherEntity, TView> : ControllerBase
        where TEntity : class, IUser
        where TOtherEntity : class, IUser
        where TView : class
    {
        private readonly IUnitOfWork uw;
        private readonly INotifyHub notifyHub;
        private readonly IMapper mapper;

        public UsersController(
            IUnitOfWork uw,
            INotifyHub notifyHub,
            IMapper mapper
        )
        {
            this.uw = uw;
            this.notifyHub = notifyHub;
            this.mapper = mapper;
        }

        [HttpGet("filter")]
        public async IAsyncEnumerable<TView> GetFiltered(
            [FromQuery] UserFilterParams filterParams
        )
        {
            var filter = DynamicExpressions.CreateFilter<TOtherEntity>(filterParams);
            var users = uw.Repository<TOtherEntity>().GetAllAsync(filterParams.FetchLength, filter);
            await foreach (var user in users)
                yield return mapper.Map<TView>(user);
        }

        [HttpGet]
        public async Task<IEnumerable<TView>> GetPaged(
            [FromQuery] UsersPagingParamsVM paramsVM
        )
        {
            var usersList = await uw.Repository<TOtherEntity>().GetAllAsync(paramsVM);
            Response.Headers.Add("X-Pagination",
                JsonConvert.SerializeObject(mapper.Map<PagingMetadata>(usersList)));
            return mapper.Map<IEnumerable<TView>>(usersList);
        }

        [HttpGet("related")]
        public async Task<IEnumerable<TView>> GetRelated()
        {
            TEntity user = await getCurrentUser();
            return mapper.Map<IEnumerable<TView>>(user.RelatedUsers);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody]EmailVM emailVM)
        {
            TOtherEntity relatedUser = await uw.Repository<TOtherEntity>()
                .GetAsync(u => u.UserName == emailVM.Email);

            if (relatedUser != null)
            {
                TEntity user = await getCurrentUser();
                bool hasRelation = user.RelatedUsers.FirstOrDefault(p => p.UserName == emailVM.Email) != null;
                
                if (!hasRelation)
                {
                    user.RelatedUsers.Add(relatedUser);
                    await uw.Save();
                    await notifyHub.NotifyIfConnected(relatedUser.Id, user, NotifyState.OnRelationCreated);
                    return StatusCode((int)HttpStatusCode.Created);
                }

                return BadRequest(new ValidationError(
                    ErrorType.UnexpectedError,
                    "Such a user is already added!"
                ));
            }
            return NotFound(new ValidationError(
                ErrorType.UnexpectedError,
                "There is no such a user to add!"
            ));
        }

        [HttpDelete]
        public async Task<IActionResult> Delete([FromQuery]EmailVM emailVM)
        {
            var user = await getCurrentUser();
            var relatedUser = user.RelatedUsers.Where(u => u.UserName == emailVM.Email).FirstOrDefault();

            if (relatedUser != null)
            {
                user.RelatedUsers.Remove(relatedUser);
                await uw.Save();
                await notifyHub.NotifyIfConnected(relatedUser.Id, user, NotifyState.OnRelationDeleted);
                return NoContent();
            }
            return NotFound(new ValidationError(
                ErrorType.UnexpectedError,
                "There is no such a user to delete!"
            ));
        }

        private Task<TEntity> getCurrentUser()
        {
            string sub = User.GetClaim(OpenIdConnectConstants.Claims.Subject);
            return uw.Repository<TEntity>().GetAsync(u => u.Id == sub, u => u.RelatedUsers);
        }
    }
}