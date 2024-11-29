using Ecommerce.Models.Database;
using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Dtos;
using Ecommerce.Models.Mappers;

namespace Ecommerce.Services;

public class OrderService
{
    private readonly UnitOfWork _unitOfWork;
    private readonly OrderMapper _orderMapper;
    public OrderService(UnitOfWork unitOfWork, OrderMapper orderMapper)
    {
        _unitOfWork = unitOfWork;
        _orderMapper = orderMapper;
    }

    // obtener por id
    public async Task<OrderDto> GetByIdAsync(int id)
    {
        var order = await _unitOfWork.OrderRepository.GetOrderById(id);

        if (order == null)
        {
            return null;
        }

        return _orderMapper.OrderToDto(order);
    }

    // obtener pedidos dto por id de usuario
    public async Task<List<OrderDto>> GetOrderByUser(int id)
    {
        if (id <= 0) throw new ArgumentException("El ID no es válido.");

        var orders = await _unitOfWork.OrderRepository.GetOrderByUser(id);

        if (orders.Count == 0)
        {
            return null;
        }

        var ordersDto = _orderMapper.OrdersToDto(orders).ToList();

        return ordersDto;
    }



    // crear un pedido, elimina el temporal y elimina del carrito
    public async Task<Order> CreateOrderAsync(TemporalOrder temporal)
    {
        var t = await _unitOfWork.TemporalOrderRepository.GetByIdAsync(temporal.Id);

        // creo pedido
        var newOrder = new Order
        {
            UserId = (int)temporal.UserId,
            PaymentDate = DateTime.Now,
            PaymentMethod = temporal.PaymentMethod,
            TotalPrice = temporal.TotalPrice,
            // agregar productos
            ProductsOrder = temporal.TemporalProductOrder.Select(pc => new ProductOrder
            {
                Quantity = pc.Quantity,
                ProductId = pc.Product.Id
            }).ToList(),
        };

        // guardo pedido
        var order = await _unitOfWork.OrderRepository.InsertAsync(newOrder);



        // Quitas del carrito
        var cart = await _unitOfWork.CartRepository.GetCartByUserId((int)t.UserId); // carrito del usuario

        foreach (var p in temporal.TemporalProductOrder)
        {
            var quantity = p.Quantity; // cantidad a restar
            
            foreach (var pc in cart.ProductCarts)
            {
                // busca el producto en el carrito y resta la cantidad
                if (pc.ProductId == p.ProductId)
                {
                    pc.Quantity -= quantity;
                }

                // si la cantidad es 0, se elimina del carrito
                if (pc.Quantity <= 0)
                {
                    await _unitOfWork.ProductCartRepository.Delete(pc);
                }
                else _unitOfWork.ProductCartRepository.Update(pc);
            }
        };

        // Elimino la orden temporal para que no restaure el stock con el servicio
        await _unitOfWork.TemporalOrderRepository.Delete(t);
            
        await _unitOfWork.SaveAsync();

        return order;

    }


}
