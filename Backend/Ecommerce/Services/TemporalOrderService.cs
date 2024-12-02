using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Database;
using Ecommerce.Models.Mappers;
using Ecommerce.Models.Dtos;

namespace Ecommerce.Services;

public class TemporalOrderService
{
    private readonly UnitOfWork _unitOfWork;
    private readonly TemporalOrderMapper _temporalOrderMapper;
    public TemporalOrderService(UnitOfWork unitOfWork, TemporalOrderMapper temporalOrderMapper)
    {
        _unitOfWork = unitOfWork;
        _temporalOrderMapper = temporalOrderMapper;
    }

    // obtener por id dto
    public async Task<TemporalOrderDto> GetDtoByIdAsync(int id)
    {
        if (id <= 0 ) throw new ArgumentException("El ID no es válido.");

        var temporalOrder = await _unitOfWork.TemporalOrderRepository.GetTemporalOrderById(id);

        if (temporalOrder == null)
        {
            return null;
        }

        return _temporalOrderMapper.TemporalOrderToDto(temporalOrder);
    }

    // obtener por id NO DTO
    public async Task<TemporalOrder> GetByIdAsync(int id)
    {
        if (id <= 0) throw new ArgumentException("El ID no es válido.");

        var temporalOrder = await _unitOfWork.TemporalOrderRepository.GetTemporalOrderById(id);

        if (temporalOrder == null)
        {
            return null;
        }
        return temporalOrder;

    }

    // obtener por id SIN DTO
    public async Task<TemporalOrder> GetOrderByIdAsync(int id)
    {
        if (id <= 0) throw new ArgumentException("El ID no es válido.");

        var temporalOrder = await _unitOfWork.TemporalOrderRepository.GetByIdAsync(id);

        if (temporalOrder == null)
        {
            return null;
        }

        return temporalOrder;
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

        await _unitOfWork.SaveAsync();

        return await _unitOfWork.TemporalOrderRepository.InsertTemporalOrderLocalAsync(cart, paymentMethod);

    }


    // crear order temporal DESDE LA BBDD
    public async Task<TemporalOrder> CreateTemporalOrderBBDDAsync(CartDto cart, string paymentMethod)
    {

        var user = await _unitOfWork.UserRepository.GetUserById(cart.UserId);


        if (paymentMethod == null || paymentMethod == "")
        {
            throw new InvalidOperationException("El método de pago no es válido");
        }

        if (cart == null || cart.Products == null)
        {
            throw new ArgumentNullException("El carrito o los productos en el carrito son nulos.");
        }

        // reserva de stock 
        foreach (var cartItem in cart.Products)
        {

            var product = await _unitOfWork.ProductRepository.GetByIdAsync(cartItem.ProductId);

            // actualiza el stock del producto
            product.Stock = product.Stock - cartItem.Quantity;
            await UpdateProduct(product);

            // asigna el producto a la orden 
            cartItem.Product = product;
        }

        TemporalOrder temporalOrder = await _unitOfWork.TemporalOrderRepository.InsertTemporalOrderBBDDAsync(cart, paymentMethod);

        temporalOrder.User = user;
        await _unitOfWork.SaveAsync();

        return temporalOrder;   
    }

    // para actualizar el stock y guardarlo
    public async Task UpdateProduct(Product product)
    {
        _unitOfWork.ProductRepository.Update(product);
        await _unitOfWork.SaveAsync();
    }

    // Actualiza la orden temporal
    public async Task<TemporalOrder> UpdateOrder(TemporalOrder temporalOrder)
    {
        TemporalOrder newTemporalOrder = _unitOfWork.TemporalOrderRepository.Update(temporalOrder);
        await _unitOfWork.SaveAsync();
        return newTemporalOrder;
    }

    // Vincular orden temporal con usuario
    public async Task<TemporalOrder> LinkUserToOrderAsync(int temporalOrderId, int userId)
    {
        if (temporalOrderId <= 0)
        {
            throw new ArgumentException("El ID de la orden temporal no es válido.");
        }

        var temporalOrder = await _unitOfWork.TemporalOrderRepository.GetByIdAsync(temporalOrderId);

        if (temporalOrder == null)
        {
            throw new InvalidOperationException("La orden temporal no existe.");
        }

        // Asignar el usuario a la orden
        temporalOrder.UserId = userId;

        var updatedOrder = _unitOfWork.TemporalOrderRepository.Update(temporalOrder);
        await _unitOfWork.SaveAsync();

        return updatedOrder;
    }

}
