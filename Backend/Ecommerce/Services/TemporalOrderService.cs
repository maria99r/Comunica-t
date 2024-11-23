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
    public async Task<TemporalOrder> CreateTemporalOrderLocalAsync(ProductCartDto[] cart)
    {
        
        /*if (paymentMethod == null || paymentMethod == "")
        {
            throw new InvalidOperationException("El método de pago no es válido");
        }*/

        return await _unitOfWork.TemporalOrderRepository.InsertTemporalOrderLocalAsync(cart);

    }


    // crear order temporal DESDE LA BBDD
    public async Task<TemporalOrder> CreateTemporalOrderBBDDAsync(CartDto cart, string paymentMethod)
    {

        if (paymentMethod == null || paymentMethod == "")
        {
            throw new InvalidOperationException("El método de pago no es válido");
        }

        return await _unitOfWork.TemporalOrderRepository.InsertTemporalOrderBBDDAsync(cart, paymentMethod);

        return temporalOrder;
    }


}
