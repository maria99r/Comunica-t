using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Dtos;
using Ecommerce.Models.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Models.Database.Repositories.Implementations;

public class TemporalOrderRepository : Repository<TemporalOrder, int>
{
    private readonly TemporalOrderMapper _temporalOrderMapper;


    public TemporalOrderRepository(EcommerceContext context) : base(context)
    {
        _temporalOrderMapper = new TemporalOrderMapper();
       
    }

    // Crear una orden temporal
    public async Task<TemporalOrder> InsertTemporalOrderAsync(CartDto cart, String paymentMethod)
    {


    // precio total
    var total = cart.ProductCarts.Sum(pc => pc.Quantity * pc.Product.Price);

        var newTemporalOrder = new TemporalOrder
        {
            UserId = cart.UserId,
            PaymentMethod = paymentMethod,
            TotalPrice = total,
            // pasamos los productos del carrito a la orden
            TemporalProductOrder = cart.ProductCarts.Select(pc => new TemporalProductOrder
            {
                Quantity = pc.Quantity,
                ProductId = pc.Product.Id
            }).ToList(),
            // User = cart.User, // es un userDto 

            ExpiresAt = DateTime.UtcNow.AddMinutes(15) // expira en 15 minutos
        };

        var insertedTemporalOrder = await InsertAsync(newTemporalOrder);

        if (insertedTemporalOrder == null)
        {
            throw new Exception("No se pudo crear la orden temporal.");
        }

        return newTemporalOrder;
    }

}

