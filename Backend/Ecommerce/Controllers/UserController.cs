using Ecommerce.Models;
using Ecommerce.Models.Database.Repositories.Implementations;
using Ecommerce.Services;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        // devuelve un usuario buscado por email
        [HttpGet("/email/{email}")]
        public async Task<IActionResult> GetByEmailAsync(string email)
        {
            var user = await _userService.GetByEmail(email);

            if (user == null) // si no se encuentra el correo
            {
                return NotFound(new { message = $"El usuario con el correo: '{email}' no ha sido encontrado." }); 
            }

            return Ok(user); 
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var user = await _userService.GetByIdAsync(id); 

            if (user == null) 
            {
                return NotFound(new { message = $"El usuario con el id '{id}' no ha sido encontrado." });
            }

            return Ok(user); 
        }


    }
}
