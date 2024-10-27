using Ecommerce.Models.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Models.Database.Repositories.Implementations
{
    public class UserRepository : Repository<User>
    {
        public UserRepository(EcommerceContext context) : base(context)
        {

        }

        // Muestra el usuario que tenga el email pasado por parámetro
        public async Task<User?> GetByEmailAsync(string email)
        {
            return await GetQueryable()
                .FirstOrDefaultAsync(user => user.Email == email);
        }
    }
}
