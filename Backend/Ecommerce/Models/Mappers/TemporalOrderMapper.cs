using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Dtos;
using System.Collections.Generic;

namespace Ecommerce.Models.Mappers;

public class TemporalOrderMapper
{
    private readonly UserMapper _userMapper;


    public TemporalOrderMapper()
    {
        _userMapper = new UserMapper();
    }


    public TemporalOrderDto TemporalOrderToDto(TemporalOrder temporalOrder)
    {
        if (temporalOrder == null)
        {
            throw new ArgumentNullException(nameof(temporalOrder), "La orden es nula");

        }

        return new TemporalOrderDto
        {
            Id = temporalOrder.Id,
            UserId = temporalOrder.UserId,
            User = _userMapper.UserToDto(temporalOrder.User), // Usa el UserMapper para el usuario
            TemporalProductOrder = temporalOrder.TemporalProductOrder.Select(pc => new TemporalProductOrder
            {
                TemporalOrderId = pc.TemporalOrderId,
                ProductId = pc.ProductId,
                Quantity = pc.Quantity,
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

    // Mapea una colección de Ordenes temporales a una colección DTO
    public IEnumerable<TemporalOrderDto> TemporalOrderToDto(IEnumerable<TemporalOrder> temporalOrders)
    {
        return temporalOrders.Select(TemporalOrderToDto);
    }
}
