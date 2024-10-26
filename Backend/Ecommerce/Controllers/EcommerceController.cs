using Ecommerce.Models;
using Ecommerce.Models.Database.Repositories.Implementations;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EcommerceController : ControllerBase
    {
        private readonly UserRepository _userRepository;

        public EcommerceController(UserRepository userRepository) {
            _userRepository = userRepository;
        }
        
        // Devuelve un usuario buscado por email
        [HttpGet("{email}")]
        public async Task<IActionResult> GetByEmail(string email)
        {
            var user = await _userRepository.GetByEmail(email);

            if (user == null) // Si no se encuentra el correo
            {
                return NotFound(new { message = $"El usuario con el correo: '{email}' no ha sido encontrado." }); // Da un mensaje de error
            }

            return Ok(user); // Devuelve el usuario encontrado
        }
    }
}
