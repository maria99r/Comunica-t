using Ecommerce.Models.Database.Entities;

namespace Ecommerce.Models.Database.Repositories.Implementations;

public class TemporalProductOrderRepository : Repository<TemporalProductOrder, int>
{
    public TemporalProductOrderRepository(EcommerceContext context) : base(context)
    { }


}
