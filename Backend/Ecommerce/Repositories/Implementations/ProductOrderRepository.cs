using Ecommerce.Models;

namespace Ecommerce.Repositories.Implementations
{
    public class ProductOrderRepository : Repository<ProductOrder, int>
    {
        public ProductOrderRepository(EcommerceContext context) : base(context)
        {

        }
    }
}
