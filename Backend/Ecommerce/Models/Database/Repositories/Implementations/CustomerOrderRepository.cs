using Ecommerce.Models.Database.Entities;

namespace Ecommerce.Models.Database.Repositories.Implementations
{
    public class CustomerOrderRepository : Repository<CustomerOrder>
    {
        public CustomerOrderRepository(EcommerceContext context) : base(context)
        {

        }
    }
}
