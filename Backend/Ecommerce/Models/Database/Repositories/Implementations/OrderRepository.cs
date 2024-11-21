using Ecommerce.Models.Database.Entities;

namespace Ecommerce.Models.Database.Repositories.Implementations;

public class OrderRepository : Repository<Order, int>
{
    public OrderRepository(EcommerceContext context) : base(context)
    {

    }
}
