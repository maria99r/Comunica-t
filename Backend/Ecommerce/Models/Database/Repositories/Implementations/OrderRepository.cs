using Ecommerce.Models.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Models.Database.Repositories.Implementations;

public class OrderRepository : Repository<Order, int>
{
    public OrderRepository(EcommerceContext context) : base(context) { }


    // crear pedido desde orden temporal
    public async Task<Order> InsertOrderAsync(TemporalOrder temporalOrder)
    {
        var newOrder = new Order
        {
            UserId = (int)temporalOrder.UserId,
            PaymentDate = DateTime.Now,
            PaymentMethod = temporalOrder.PaymentMethod,
            TotalPrice = temporalOrder.TotalPrice,
            User = null,
            // agregar productos
            ProductsOrder = temporalOrder.TemporalProductOrder.Select(pc => new ProductOrder
            {
                Quantity = pc.Quantity,
                ProductId = pc.Product.Id,
                Product = null 
            }).ToList(),
        };

        var insertedOrder = await InsertAsync(newOrder);


        if (insertedOrder == null)
        {
            throw new Exception("No se pudo insertar el pedido.");
        }

        return newOrder;
    }


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

}
