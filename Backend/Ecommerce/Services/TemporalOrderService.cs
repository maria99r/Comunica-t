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

    // crear order temporal (hay que mapear el user para que no se vean los datos)
    public async Task<TemporalOrder> CreateTemporalOrderAsync(CartDto cart, string paymentMethod)
    {
        
        if (paymentMethod == null || paymentMethod == "")
        {
            throw new InvalidOperationException("El método de pago no es válido");
        }

        return await _unitOfWork.TemporalOrderRepository.InsertTemporalOrderAsync(cart, paymentMethod);

    }
}
