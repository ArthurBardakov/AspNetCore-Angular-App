using ResourceAuthServer.EFCore.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ResourceAuthServer.EFCore
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly HospitalContext _context;
        private readonly Dictionary<Type, object> _repositories = new Dictionary<Type, object>();
        private bool disposed;

        public UnitOfWork(HospitalContext context)
        {
            _context = context;
        }

        public IGenericRepository<T> Repository<T>() where T : class
        {
            if (_repositories.Keys.Contains(typeof(T)))
            {
                return _repositories[typeof(T)] as IGenericRepository<T>;
            }

            IGenericRepository<T> repo = new GenericRepository<T>(_context);
            _repositories.Add(typeof(T), repo);
            return repo;
        }

        public async Task<int> Save()
        {
            return await _context.SaveChangesAsync();
        }

        public virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
                disposed = true;
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}