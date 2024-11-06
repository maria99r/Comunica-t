using System;
using System.Collections.Generic;

namespace Ecommerce.Models.Database.Entities;

public class ProductOrder
{
    public int Quantity { get; set; }

    public int OrderId { get; set; }

    public int ProductId { get; set; }

    public virtual CustomerOrder Order { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
