using Ecommerce.Helpers;
using Ecommerce.Models.Database;
using Ecommerce.Models.Database.Entities;

namespace Ecommerce.Services
{
    public class UserService
    {
        private readonly UnitOfWork _unitOfWork;

        public UserService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // Registro
        public async Task<User> RegisterUserAsync(User newUser, string password)
        {
            // Verifica si el email ya está en uso
            var emailExist = await _unitOfWork.UserRepository.GetByEmailAsync(newUser.Email);
            if (emailExist != null)
            {
                throw new InvalidOperationException("Este email ya está en uso.");
            }

            // Hashea la contraseña y la guarda hasheada en la tabla 
            newUser.Password = PasswordHelper.Hash(password);

            // Guarda el nuevo usuario en la tabla User de la BBDD
            await _unitOfWork.UserRepository.InsertAsync(newUser);
            await _unitOfWork.SaveAsync();
            return newUser;
        }

        // Login
        public async Task<User?> LoginAsync(string email, string password)
        {
            // Obtiene el usuario según el email introducido
            var user = await _unitOfWork.UserRepository.GetByEmailAsync(email);

            // Verifica que el usuario exista y la contraseña coincida
            if (user != null || !PasswordHelper.Verify(password, user.Password))
            {
                throw new InvalidOperationException("Datos de inicio de sesión incorrectos.");
            }

            return user;
        }
    }
}
