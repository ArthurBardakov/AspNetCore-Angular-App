AspNetCore-Angular-App

# Detailed Description
The project represents an AspNetCoreApi on the server-side and an Angular 9 SPA on the client-side.
Token-based authentication is used for users' auth using JwtBearer scheme. IdentityServer4 is used as user authentication system. Grant types used: Code and ResourceOwnerPassword (two for example purposes). Code flow with PKCE for external authentication and ResourceOwnerPassword for custom form. AspNetCore Identity is added as login functionality and for manipulating user accounts. SignalR is used for the live data update. ApplicationPartManager is used for generic controllers support for the sake of removing duplicate CRUD logic.

# Stack of technologies
    Server-side:
        1) .Net Core 3.1.4
        2) EFCore 3.1.4
        3) IdentityServer4 3.1.4
        4) Npgsql.EntityFrameworkCore.PostgreSQL 3.1.4
        ...
    Client-side:
        1) Angular CLI 9.1.6
        2) @aspnet/signalr
        3) angular-oauth2-oidc
        4) @angular/material
        ...
