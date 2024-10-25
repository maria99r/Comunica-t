namespace Ecommerce.Repositories.Interfaces
{
    public interface IUserRepository<TEntity, TId> where TEntity : class
    {
        Task<TEntity> GetByEmail(TEntity entity);
    }
}
