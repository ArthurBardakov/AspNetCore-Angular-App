using System;
using System.Threading.Tasks;

namespace ResourceAuthServer.EFCore.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<TEntity> Repository<TEntity>() where TEntity : class;

        Task<int> Save();
    }
}