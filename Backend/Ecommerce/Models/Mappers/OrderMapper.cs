using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Dtos;
using System.Collections.Generic;

namespace Ecommerce.Models.Mappers;

public class OrderMapper
{
    private readonly UserMapper _userMapper;


    public OrderMapper()
    {
        _userMapper = new UserMapper();
    }


    public OrderDto OrderToDto(Order order)
    {
        if (order == null)
        {
            throw new ArgumentNullException(nameof(order), "El pedido es nulo");

        }

        return new OrderDto
        {
            Id = order.Id,
            UserId = order.UserId,
            PaymentDate = order.PaymentDate,
            TotalPrice = order.TotalPrice,
            PaymentMethod = order.PaymentMethod,
            User = _userMapper.UserToDto(order.User), // Usa el UserMapper para el usuario
            ProductsOrder = order.ProductsOrder.Select(pc => new ProductOrder
            {
                OrderId = pc.OrderId,
                ProductId = pc.ProductId,
                Quantity = pc.Quantity,
                // añadir pricePay PricePay = pc.Product.Price
                Product = new Product
                {
                    Id = pc.Product.Id,
                    Name = pc.Product.Name,
                    Price = pc.Product.Price,
                    Stock = pc.Product.Stock,
                    Description = pc.Product.Description,
                    Image = pc.Product.Image
                }
            }).ToList()
        };
    }

    // Mapea una colección de Ordenes a una colección DTO
    public IEnumerable<OrderDto> OrdersToDto(IEnumerable<Order> orders)
    {
        return orders.Select(OrderToDto);
    }
}
