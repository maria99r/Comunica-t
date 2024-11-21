using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace Ecommerce.Models.Database.Entities;

[PrimaryKey(nameof(TemporalOrderId), nameof(ProductId))]
public class TemporalProductOrder
{
    public int Quantity { get; set; }

    public int TemporalOrderId { get; set; }

    public int ProductId { get; set; }

    public virtual TemporalOrder TemporalOrder { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
