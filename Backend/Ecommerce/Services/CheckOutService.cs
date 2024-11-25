using Ecommerce.Models.Database;
using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Database.Repositories.Implementations;
using Ecommerce.Models.Dtos;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Services
{
    public class CheckoutService
    {
        private readonly UnitOfWork _unitOfWork;

        public CheckoutService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // obtener carrito por id de usuario
        //public async Task<CartDto> GetCartByUserIdAsync(int id)
        //{
        //    CartDto cartDto = await _unitOfWork.CartRepository.GetCartByUserId(id);

        //    if (cartDto == null)
        //    {
        //        return null;
        //    }

        //    return cartDto;
        //}

        public async Task<double> GetSumaTotalAsync(int cartId)
        {
            double totalPrice = await _unitOfWork.CheckOutRepository.GetTotalPrice(cartId);
            
            return totalPrice;
        }
    }
}
