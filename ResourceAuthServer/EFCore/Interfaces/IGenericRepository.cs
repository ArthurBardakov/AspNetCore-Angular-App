using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace ResourceAuthServer.EFCore.Interfaces
{
    public interface IGenericRepository<TEntity> where TEntity : class
    {
        Task<PagedList<TEntity>> GetAllAsync(
            IPagingParams collectionParams,
            params Expression<Func<TEntity, object>>[] includeProperties
        );

        IAsyncEnumerable<TEntity> GetAllAsync(
            int takeLength,
            Expression<Func<TEntity, bool>> predicate,
            params Expression<Func<TEntity, object>>[] includeProperties
        );

        Task<TEntity> GetAsync(
            Expression<Func<TEntity, bool>> predicate,
            params Expression<Func<TEntity, object>>[] includeProperties
        );

        void Create(TEntity item);
        void Update(TEntity item);
        void Delete(TEntity item);
    }
}
