using Ecommerce.Models;

namespace Ecommerce.Repositories.Implementations
{
    public class Product : Repository<Product, int>
    {
        public Product(EcommerceContext context) : base(context)
        {

        }
    }
}
