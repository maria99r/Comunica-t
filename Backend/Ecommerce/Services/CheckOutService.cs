using Ecommerce.Models.Database;
using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Database.Repositories.Implementations;
using Ecommerce.Models.Dtos;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Services
{
    public class CheckOutService
    {
        private readonly UnitOfWork _unitOfWork;

        public CheckOutService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // obtener carrito por id de usuario
        public async Task<CartDto> GetCartByUserIdAsync(int id)
        {
            CartDto cartDto = await _unitOfWork.CartRepository.GetCartByUserId(id);

            if (cartDto == null)
            {
                return null;
            }

            return cartDto;
        }

    }
}
