using Ecommerce.Models.Database.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Ecommerce.Models.Database.Repositories.Implementations
{
    // Implementación del repositorio común
    public abstract class Repository<TEntity> : IRepository<TEntity> where TEntity : class
    {
        protected EcommerceContext _context;

        public Repository(EcommerceContext context)
        {
            _context = context;
        }

        public async Task<ICollection<TEntity>> GetAllAsync()
        {
            return await _context.Set<TEntity>().ToArrayAsync();
        }

        public IQueryable<TEntity> GetQueryable(bool asNoTracking = true)
        {
            DbSet<TEntity> entities = _context.Set<TEntity>();
            return asNoTracking ? entities.AsNoTracking() : entities;
        }

        public async Task<TEntity> GetByIdAsync(object id)
        {
            return await _context.Set<TEntity>().FindAsync(id);
        }

        public async Task<TEntity> InsertAsync(TEntity entity)
        {
            EntityEntry<TEntity> entry = await _context.Set<TEntity>().AddAsync(entity);

            return entry.Entity;
        }

        public TEntity Update(TEntity entity)
        {
            EntityEntry<TEntity> entry = _context.Set<TEntity>().Update(entity);

            return entry.Entity;
        }

        public void Delete(TEntity entity)
        {
            _context.Set<TEntity>().Remove(entity);
        }

        public async Task<bool> ExistAsync(object id)
        {
            return await GetByIdAsync(id) != null;
        }
    }
}
