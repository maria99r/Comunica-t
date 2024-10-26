using Ecommerce.Models.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Models.Database.Repositories.Implementations
{
    public class UserRepository : Repository<User, int>
    {
        public UserRepository(EcommerceContext context) : base(context)
        {

        }

        public async Task<User?> GetByEmail(string email)
        {
            return await GetQueryable()
                .FirstOrDefaultAsync(user => user.Email == email);
        }
    }
}
