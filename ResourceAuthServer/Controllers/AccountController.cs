using FirebaseAdmin.Auth;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ResourceAuthServer.EFCore.Entities;
using ResourceAuthServer.Infrastructure.Enums;
using ResourceAuthServer.Infrastructure.Extensions;
using ResourceAuthServer.Infrastructure.Filters;
using ResourceAuthServer.Infrastructure.Interfaces;
using ResourceAuthServer.Infrastructure.Models.Account;
using ResourceAuthServer.Infrastructure.Models.Users;
using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Threading.Tasks;
using static Google.Apis.Auth.GoogleJsonWebSignature;

namespace ResourceAuthServer.Controllers
{
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly IIdentityServerInteractionService interaction;
        private static ValidationSettings googleSettings;
        private readonly INotifyHub notifyHub;
        private readonly ILogger<AccountController> logger;
        private static readonly ImmutableDictionary<Roles, Type> roleBasedTypes;
        private static readonly ImmutableList<string> rolesArray;

        static AccountController()
        {
            roleBasedTypes = new Dictionary<Roles, Type>()
            {
                { Roles.patient, typeof(Patient) },
                { Roles.doctor, typeof(Doctor) },
                { Roles.admin, typeof(ApplicationUser) }
            }.ToImmutableDictionary();

            rolesArray = typeof(Roles).GetEnumNames().ToImmutableList();
        }

        public AccountController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IIdentityServerInteractionService interaction,
            INotifyHub notifyHub,
            ILogger<AccountController> logger
        )
        {
            googleSettings = new ValidationSettings()
            {
                Audience = new string[] { Startup.Configuration["GOOGLE_CLIENT_ID"] }
            };
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.interaction = interaction;
            this.notifyHub = notifyHub;
            this.logger = logger;
        }

        [HttpGet("~/account/login")]
        public async Task<IActionResult> Login([FromQuery]string returnUrl = null)
        {
            var context = await interaction.GetAuthorizationContextAsync(returnUrl);

            if (context != null)
            {
                string idToken = context.Parameters.Get("id_token");
                FirebaseToken payload = await isGoogleIdTokenValid(idToken);

                if (payload != null)
                {
                    ExternalIdentity firebaseIdentity = payload.CreateIdentity();
                    ApplicationUser user = await userManager.FindByNameAsync(firebaseIdentity.Email);

                    if (user == null)
                    {
                        return await externalSignUpAsync(
                            firebaseIdentity,
                            context.Parameters.Get("role").ToLower(),
                            returnUrl
                        );
                    }
                    else
                    {
                        return await externalSignInAsync(
                            user,
                            firebaseIdentity,
                            returnUrl
                        );
                    }
                }
                return BadRequest(new ValidationError(
                    ErrorType.UnexpectedError,
                    "The account has not yet been confirmied or invalid id_token provided!"
                ));
            }
            return LocalRedirect("~/");
        }

        private async Task<IActionResult> externalSignUpAsync(
            ExternalIdentity firebaseIdentity,
            string roleParam,
            string returnUrl
        )
        {
            IdentityResult identityResult = null;
            int roleIndex = rolesArray.FindIndex(n => n == roleParam);

            if (roleIndex != -1)
            {
                Roles role = (Roles)roleIndex;
                ApplicationUser user = сreateRoleBasedInstance(role, firebaseIdentity);
                identityResult = await userManager.CreateAsync(user);

                if (identityResult.Succeeded)
                {
                    user.EmailConfirmed = firebaseIdentity.EmailConfirmed;
                    identityResult = await userManager.AddToRoleAsync(user, role.ToString());
                    identityResult = identityResult.Succeeded ?
                        await userManager.AddLoginAsync(
                            user, 
                            new UserLoginInfo(
                                firebaseIdentity.SignInProvider,
                                firebaseIdentity.ProviderKey,
                                firebaseIdentity.SignInProvider
                            )
                        ) : identityResult;

                    if (identityResult.Succeeded)
                    {
                        await notifyHub.NotifyOfNewUser(user, role);
                        return SignResult(
                            await signInManager.ExternalLoginSignInAsync(
                                firebaseIdentity.SignInProvider,
                                firebaseIdentity.ProviderKey,
                                true
                            ),
                            returnUrl
                        );
                    }
                }

                AddErrors(identityResult);
                return BadRequest(new ApiError(ModelState));
            }
            else
            {
                return BadRequest(new ValidationError(
                    ErrorType.UnexpectedError,
                    "Ivalid user role provided!"
                ));
            }
        }

        private async Task<IActionResult> externalSignInAsync(
            ApplicationUser user,
            ExternalIdentity firebaseIdentity,
            string returnUrl
        )
        {
            IEnumerable<UserLoginInfo> logins = await userManager.GetLoginsAsync(user);
            IdentityResult identityResult = null;

            if (!logins.Any(ui => ui.ProviderKey == firebaseIdentity.ProviderKey))
            {
                identityResult = await userManager.AddLoginAsync(
                    user, 
                    new UserLoginInfo(
                        firebaseIdentity.SignInProvider,
                        firebaseIdentity.ProviderKey,
                        firebaseIdentity.SignInProvider
                    )
                );
            }

            if (identityResult == null || identityResult.Succeeded)
            {
                return SignResult(
                    await signInManager.ExternalLoginSignInAsync(
                        firebaseIdentity.SignInProvider,
                        firebaseIdentity.ProviderKey,
                        true
                    ),
                    returnUrl
                );
            }
            
            AddErrors(identityResult);
            return BadRequest(new ApiError(ModelState));
        }

        private async Task<FirebaseToken> isGoogleIdTokenValid(string idToken)
        {
            try
            {
                return await FirebaseAuth.GetAuth(Startup.FirebaseApp)
                    .VerifyIdTokenAsync(idToken);
            }
            catch (FirebaseAuthException)
            {
                return null;
            }
        }

        private ApplicationUser сreateRoleBasedInstance(Roles role, ISignInVM identity)
        {
            roleBasedTypes.TryGetValue(role, out Type userType);
            return (ApplicationUser)Activator.CreateInstance(
                userType,
                identity.Email,
                identity.FirstName,
                identity.LastName
            );
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody]RegisterVM registerVM, string returnUrl = null)
        {
            Roles role = (Roles)rolesArray.FindIndex(n => n == registerVM.Role);
            var user = сreateRoleBasedInstance(role, registerVM);
            var identityResult = await userManager.CreateAsync(user, registerVM.Password);

            if (identityResult.Succeeded)
            {
                identityResult = await userManager.AddToRoleAsync(user, registerVM.Role);

                if (identityResult.Succeeded)
                {
                    await notifyHub.NotifyOfNewUser(user, role);
                    return Ok();
                }
            }

            AddErrors(identityResult);
            return BadRequest(new ApiError(ModelState));
        }

        [HttpGet("~/account/logout")]
        public async Task<IActionResult> Logout(string logoutId)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return BadRequest(new ValidationError(
                    ErrorType.UnexpectedError,
                    "You have not been authenticated!"
                ));
            }

            var context = await interaction.GetLogoutContextAsync(logoutId);
            if (context != null)
            {
                if (context.ShowSignoutPrompt == false)
                {
                    await signInManager.SignOutAsync();
                    return Redirect(context.PostLogoutRedirectUri);
                }
                else
                {
                    // need show the logout prompt in order to prevent being
                    // automatically signed out by another malicious web page.
                    return LocalRedirect("~/");
                }
            }

            return BadRequest(new ValidationError(
                ErrorType.UnexpectedError,
                "Invalid logout id!"
            ));
        }


        [HttpGet("checkUser")]
        public async Task<bool> CheckUsername([FromQuery]EmailVM model)
        {
            return await userManager.FindByNameAsync(model.Email) != null;
        }

        #region ErrorHelpers

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                if (error.Code.Contains("DuplicateUserName"))
                {
                    var desc = error.Description.Replace("User name", "Email");
                    ModelState.AddModelError("email", desc);
                }
                else ModelState.AddModelError(error.Code, error.Description);
            }
        }

        private IActionResult SignResult(
            Microsoft.AspNetCore.Identity.SignInResult result,
            string returnUrl
        )
        {
            if (result.Succeeded)
            {
                if (Url.IsLocalUrl(returnUrl))
                {
                    return Redirect(returnUrl);
                }
                else if (!string.IsNullOrEmpty(returnUrl))
                {
                    logger.LogError($"Malicious link: {returnUrl}");
                }
                return LocalRedirect("~/");
            }
            // the only one possilbe, for the current configuration
            return BadRequest(new ValidationError(
                ErrorType.ValidationError,
                "You've acceded login attempts, try in 5 minutes, please!"
            ));
        }

        #endregion
    }
}