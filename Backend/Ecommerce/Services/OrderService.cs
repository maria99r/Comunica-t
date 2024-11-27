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
        if (id <= 0) throw new ArgumentException("El ID no es válido.");

        var order = await _unitOfWork.OrderRepository.GetByIdAsync(id);

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



    // crear un pedido
    public async Task<Order> CreateOrderAsync(TemporalOrder temporal)
    {
        // agrego al usuario
        var user = await _unitOfWork.UserRepository.GetByIdAsync((int)temporal.UserId);

        var order = await _unitOfWork.OrderRepository.InsertOrderAsync(temporal);

        order.User = user;

        await _unitOfWork.SaveAsync();

        return order;

    }


}
