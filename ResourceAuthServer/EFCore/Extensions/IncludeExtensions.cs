using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace ResourceAuthServer.EFCore.Extensions
{
    internal static class IncludeExtensions
    {
        public static IEnumerable<string> IncludeRefEntities<TEntity>(
            this Expression<Func<TEntity, object>>[] includeProperties
        ) where TEntity : class
        {
            if (includeProperties.Any())
            {
                IEnumerable<string> includeNames = getPropNames(includeProperties);
                var namesToReplace = ModelBuilderExtensions.IncludeProps.Where(e => includeNames.Contains(e.Key));

                return includeNames.Except(namesToReplace.Select(n => n.Key))
                    .Concat(namesToReplace.SelectMany(n => n.Value));
            }

            return new string[] { };
        }

        private static IEnumerable<string> getPropNames<TEntity, TProp>(
            params Expression<Func<TEntity, TProp>>[] includeProperties
        ) where TEntity : class
          where TProp : class
        {
            return includeProperties
                  .Select(p => p.Body)
                  .Cast<MemberExpression>()
                  .Select(p => p.Member.Name);
        }
    }
}