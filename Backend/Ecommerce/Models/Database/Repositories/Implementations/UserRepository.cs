using Ecommerce.Helpers;
using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Dtos;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Models.Database.Repositories.Implementations;

public class UserRepository : Repository<User, int>
{

    public UserRepository(EcommerceContext context) : base(context) { }

    public async Task<User> GetByEmail(string email)
    {
        return await GetQueryable()
            .FirstOrDefaultAsync(user => user.Email == email);
    }

    public async Task<User> GetById(int id)
    {
        return await GetQueryable()
            .FirstOrDefaultAsync(user => user.Id == id);
    }



    // Crear un nuevo usuario
    public async Task<User> InsertUserAsync(User newUser)
    {

        await base.InsertAsync(newUser);

        return newUser;

        throw new Exception("No se pudo crear el nuevo usuario.");
    }
}
