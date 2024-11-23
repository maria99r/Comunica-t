using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Database;
using Ecommerce.Models.Mappers;
using Ecommerce.Models.Dtos;

namespace Ecommerce.Services;

public class TemporalOrderService
{
    private readonly UnitOfWork _unitOfWork;
    public TemporalOrderService(UnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    // obtener por id
    public async Task<TemporalOrderDto> GetByIdAsync(int id)
    {
        TemporalOrderDto temporalOrderDto = await _unitOfWork.TemporalOrderRepository.GetTemporalCartById(id);

        if (temporalOrderDto == null)
        {
            return null;
        }

        return temporalOrderDto;
    }



    // crear order temporal DESDE EL LOCAL
    public async Task<TemporalOrder> CreateTemporalOrderLocalAsync(ProductCartDto[] cart, string paymentMethod)
    {
        
        if (paymentMethod == null || paymentMethod == "")
        {
            throw new InvalidOperationException("El método de pago no es válido");
        }

        // reserva de stock 
        foreach (var cartItem in cart) {

            var product = await _unitOfWork.ProductRepository.GetByIdAsync(cartItem.ProductId);

            // actualiza el stock del producto
            product.Stock = product.Stock - cartItem.Quantity;
            await UpdateProduct(product);
        }

        return await _unitOfWork.TemporalOrderRepository.InsertTemporalOrderLocalAsync(cart, paymentMethod);

    }


    // crear order temporal DESDE LA BBDD
    public async Task<TemporalOrder> CreateTemporalOrderBBDDAsync(CartDto cart, string paymentMethod)
    {

        if (paymentMethod == null || paymentMethod == "")
        {
            throw new InvalidOperationException("El método de pago no es válido");
        }

        // reserva de stock 
        foreach (var cartItem in cart.ProductCarts)
        {

            var product = await _unitOfWork.ProductRepository.GetByIdAsync(cartItem.ProductId);

            // actualiza el stock del producto
            product.Stock = product.Stock - cartItem.Quantity;
            await UpdateProduct(product);
        }

        return await _unitOfWork.TemporalOrderRepository.InsertTemporalOrderBBDDAsync(cart, paymentMethod);

        return temporalOrder;
    }

    // para actualizar el stock y guardarlo
    public async Task UpdateProduct(Product product)
    {
        await _unitOfWork.ProductRepository.Update(product);
        await _unitOfWork.SaveAsync();
    }
}
