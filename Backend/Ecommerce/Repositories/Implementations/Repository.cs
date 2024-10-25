using Ecommerce.Models;
using Ecommerce.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Ecommerce.Repositories.Implementations
{
    // Implementación del repositorio común
    public abstract class Repository<TEntity, TId> : IRepository<TEntity, TId> where TEntity : class
    {
        protected EcommerceContext Context { get; init; }

        public Repository(EcommerceContext context)
        {
            Context = context;
        }

        public async Task<ICollection<TEntity>> GetByEmail()
        {
            return await Context.Set<TEntity>().ToArrayAsync();
        }

        public IQueryable<TEntity> GetQueryable(bool asNoTracking = true)
        {
            DbSet<TEntity> entities = Context.Set<TEntity>();
            return asNoTracking ? entities.AsNoTracking() : entities;
        }

        public async Task<TEntity> GetByIdAsync(TId id)
        {
            return await Context.Set<TEntity>().FindAsync(id);
        }

        public async Task<TEntity> InsertAsync(TEntity entity)
        {
            EntityEntry<TEntity> entry = await Context.Set<TEntity>().AddAsync(entity);
            await SaveAsync();

            return entry.Entity;
        }

        public async Task<TEntity> UpdateAsync(TEntity entity)
        {
            EntityEntry<TEntity> entry = Context.Set<TEntity>().Update(entity);
            await SaveAsync();

            return entry.Entity;
        }

        public async Task DeleteAsync(TEntity entity)
        {
            Context.Set<TEntity>().Remove(entity);
            await SaveAsync();
        }

        public async Task<bool> SaveAsync()
        {
            return await Context.SaveChangesAsync() > 0;
        }

        public async Task<bool> ExistAsync(TId id)
        {
            return await GetByIdAsync(id) != null;
        }
    }
}
