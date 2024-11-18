using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Models.Database.Entities;

// [Keyless] lo he quitado porque sino da error de primary key al crear instancias
// la clave primaria esta compuesta por userId y productId
[PrimaryKey(nameof(CartId), nameof(ProductId))]
public class ProductCart
{
    public int CartId { get; set; }

    public int ProductId { get; set; }
    public int Quantity { get; set; }

    public Cart Cart { get; set; } = null!;

    public Product Product { get; set; } = null!;
}
