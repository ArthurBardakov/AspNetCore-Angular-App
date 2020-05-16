using Microsoft.EntityFrameworkCore;
using ResourceAuthServer.EFCore.Extensions;
using ResourceAuthServer.EFCore.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace ResourceAuthServer.EFCore
{
    public class GenericRepository<TEntity> : IGenericRepository<TEntity> where TEntity : class
    {
        protected readonly DbContext context;
        protected readonly DbSet<TEntity> dbSet;

        public GenericRepository(DbContext context)
        {
            this.context = context;
            dbSet = context.Set<TEntity>();
        }

        public Task<PagedList<TEntity>> GetAllAsync(
            IPagingParams pagingParams,
            params Expression<Func<TEntity, object>>[] includeProperties
        )
        {
            return GetWhere(null, includeProperties).ToPagedListAsync(pagingParams);
        }

        public IAsyncEnumerable<TEntity> GetAllAsync(
            int takeLength,
            Expression<Func<TEntity, bool>> predicate,
            params Expression<Func<TEntity, object>>[] includeProperties
        )
        {
            return GetWhere(predicate, includeProperties).Take(takeLength).AsAsyncEnumerable();
        }

        public async Task<TEntity> GetAsync(
            Expression<Func<TEntity, bool>> predicate,
            params Expression<Func<TEntity, object>>[] includeProperties
        )
        {
            return await GetWhere(predicate, includeProperties).SingleOrDefaultAsync();
        }

        protected IQueryable<TEntity> GetWhere(
            Expression<Func<TEntity, bool>> predicate,
            params Expression<Func<TEntity, object>>[] includeProperties
        )
        {
            IEnumerable<string> props = includeProperties.IncludeRefEntities();
            IQueryable<TEntity> query = dbSet;
            IQueryable<TEntity> aggQuery = props.Aggregate(query,
                        (current, includeProperty) => current.Include(includeProperty));

            return predicate != null ? aggQuery.Where(predicate) : aggQuery;
        }

        public void Create(TEntity item)
        {
            context.Entry(item).State = EntityState.Added;
        }

        public void Update(TEntity item)
        {
            context.Entry(item).State = EntityState.Modified;
        }

        public void Delete(TEntity item)
        {
            context.Entry(item).State = EntityState.Deleted;
        }
    }
}
