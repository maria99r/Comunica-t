namespace Ecommerce.Models.Database.Repositories.Interfaces;

// Interfaz común
public interface IRepository<TEntity, TId> where TEntity : class
{
    Task<ICollection<TEntity>> GetAllAsync();
    IQueryable<TEntity> GetQueryable(bool asNoTracking = true);
    Task<TEntity> GetByIdAsync(TId id);
    Task<TEntity> InsertAsync(TEntity entity);
    Task<TEntity> Update(TEntity entity);
    Task Delete(TEntity entity);
    Task<bool> SaveAsync();
    Task<bool> ExistAsync(TId id);
}
