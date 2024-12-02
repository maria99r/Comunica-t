using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace Ecommerce.Models.Database.Entities;

[PrimaryKey(nameof(OrderId), nameof(ProductId))]
public class ProductOrder
{
    public int Quantity { get; set; }

    public int OrderId { get; set; }

    public int ProductId { get; set; }

    // public int PricePay { get; set ; }  // hay q guardar el precio pagado para mostrar en vista perfil

    public virtual Order Order { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
