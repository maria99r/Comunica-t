using Ecommerce.Models;

namespace Ecommerce.Repositories.Implementations
{
    public class CustomerOrderRepository : Repository<CustomerOrder, int>
    {
        public CustomerOrderRepository(EcommerceContext context) : base(context)
        {

        }
    }
}
