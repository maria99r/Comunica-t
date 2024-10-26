using Ecommerce.Models.Database.Entities;

namespace Ecommerce.Models.Database.Repositories.Implementations
{
    public class ProductOrderRepository : Repository<ProductOrder>
    {
        public ProductOrderRepository(EcommerceContext context) : base(context)
        {

        }
    }
}
