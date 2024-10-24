using System;
using System.Collections.Generic;

namespace Ecommerce.Models;

public partial class ProductCart
{
    public int Quantity { get; set; }

    public int CartId { get; set; }

    public int ProductId { get; set; }

    public virtual Cart Cart { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
