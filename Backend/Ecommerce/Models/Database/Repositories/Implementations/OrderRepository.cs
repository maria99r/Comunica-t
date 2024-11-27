using Ecommerce.Models.Database.Entities;

namespace Ecommerce.Models.Database.Repositories.Implementations;

public class OrderRepository : Repository<Order, int>
{
    public OrderRepository(EcommerceContext context) : base(context) { }


    // crear orden 
    public async Task<Order> InsertOrderasync(TemporalOrder temporalOrder)
    {
        var newOrder = new Order
        {
            UserId = (int)temporalOrder.UserId,
            PaymentDate = DateTime.Now,
            PaymentMethod = temporalOrder.PaymentMethod,
            TotalPrice = temporalOrder.TotalPrice,
            User = temporalOrder.User,
            // agregar productos

        };

        var insertedOrder = await InsertAsync(newOrder);

        if (insertedOrder == null)
        {
            throw new Exception("No se pudo insertar el pedido.");
        }

        return newOrder;
    }

}
