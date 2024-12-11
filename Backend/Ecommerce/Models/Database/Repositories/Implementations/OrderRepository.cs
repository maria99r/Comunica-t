using Ecommerce.Models.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Models.Database.Repositories.Implementations;

public class OrderRepository : Repository<Order, int>
{
    public OrderRepository(EcommerceContext context) : base(context) { }


    // pedidos por usuario
    public async Task<List<Order>> GetOrderByUser(int id)
    {
        return await GetQueryable()
            .Include(order => order.User) 
            .Include(order => order.ProductsOrder)
                .ThenInclude(pc => pc.Product)
            .Where(order => order.UserId == id)
            .ToListAsync();
    }


    // obtener pedido segun id
    public async Task<Order> GetOrderById(int id)
    {
        var order = await GetQueryable()
            .Include(o => o.User)
            .Include(o => o.ProductsOrder)
            .ThenInclude(p => p.Product)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
        {
            throw new InvalidOperationException("El pedido no se encontró para esta id.");
        }
        return order;
    }

}
