using System;
using System.Linq.Expressions;
using System.Reflection;
using ResourceAuthServer.EFCore.Interfaces;
using ResourceAuthServer.Infrastructure.Models.Users;

namespace ResourceAuthServer.Infrastructure.Helpers
{
    public static class DynamicExpressions
    {
        private static readonly MethodInfo toLowerMeth;
        private static readonly MethodInfo containsMeth;
        
        static DynamicExpressions()
        {
            toLowerMeth = typeof(string).GetMethod("ToLower", new Type[] {});
            containsMeth = typeof(string).GetMethod("Contains", new[] { typeof(string) });
        }
        
        public static Expression<Func<TEntity, bool>> CreateFilter<TEntity>(
            UserFilterParams filterParams
        ) where TEntity: class, IUser
        {
            Type entityType = typeof(TEntity);
            var parameter = Expression.Parameter(entityType, "user");
            var property = Expression.Property(parameter, entityType.GetProperty(filterParams.FilterOption.ToString()));
            var toLowerCall = Expression.Call(property, toLowerMeth);
            var containsCall = Expression.Call(toLowerCall, containsMeth, Expression.Constant(filterParams.FilterValue, typeof(string)));
            return Expression.Lambda<Func<TEntity, bool>>(containsCall, parameter);
        }
    }
}