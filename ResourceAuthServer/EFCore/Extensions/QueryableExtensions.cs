using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ResourceAuthServer.EFCore.Interfaces;

namespace ResourceAuthServer.EFCore.Extensions
{
    internal static class QueryableExtensions
    {
        public static async Task<PagedList<TEntity>> ToPagedListAsync<TEntity>(
            this IQueryable<TEntity> source,
            IPagingParams pagingParams
        )
        {
            if (source == null)
            {
                throw new ArgumentNullException(nameof(source));
            }

            if (pagingParams == null)
            {
                throw new ArgumentNullException(nameof(pagingParams));
            }

            if (pagingParams.PageNumber < 0 || pagingParams.PageSize < 0)
            {
                throw new ArgumentException("Page number or page size cannot be less than zero!");
            }

            PagedList<TEntity> pagedList = new PagedList<TEntity>(pagingParams, await source.CountAsync());   
            var items = await source.Skip((pagingParams.PageNumber - 1) * pagingParams.PageSize)
                                   .Take(pagingParams.PageSize)
                                   .ToListAsync();
            pagedList.AddRange(items);
            return pagedList;
        }
    }
}