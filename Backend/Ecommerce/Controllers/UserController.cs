using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Dtos;
using Ecommerce.Models.Mappers;
using Ecommerce.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly UserMapper _userMapper;

        public UserController(UserService userService, UserMapper userMapper)
        {
            _userService = userService;
            _userMapper = userMapper;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);

            if (user == null)
            {
                return NotFound(new { message = $"El usuario con el id '{id}' no ha sido encontrado." });
            }

            return Ok(user);
        }

        //obtener todos los usuarios
        [HttpGet("allUsers")]
        public async Task<IActionResult> GetAllUsersAsync()
        {
            var user = await _userService.GetAllUsersAsync();

            return Ok(user);
        }

        [Authorize]
        [HttpPut("modifyUser")]
        public async Task<IActionResult> ModifyUser([FromBody] UserProfileDto userDto)
        {

            // Obtener datos del usuario para modificarse a si mismo
            UserProfileDto userData = await ReadToken();

            if (userData == null)
            {
                Console.WriteLine("Token inválido o usuario no encontrado.");
                return BadRequest("El usuario es null");
            }

            Console.WriteLine($"Usuario autenticado: ID = {userData.UserId}, Email = {userData.Email}");
            userDto.UserId = userData.UserId;
            try
            {
                await _userService.ModifyUserAsync(userDto);
                return Ok("Usuario actualizado correctamente.");
            }
            catch (InvalidOperationException)
            {
                return BadRequest("No pudo modificarse el usuario.");
            }
        }

        // Solo pueden usar este método los usuarios cuyo rol sea admin
        [Authorize(Roles = "Admin")]
        [HttpPut("modifyUserRole")]
        public async Task<IActionResult> ModifyUserRole(ModifyRoleRequest request)
        {

            // Obtener datos del usuario
            UserDto userData = await _userService.GetUserByIdAsync(request.UserId);

            if (userData == null)
            {
                return BadRequest("El usuario es null");
            }

            try
            {
                if (request.NewRole == "User" || request.NewRole == "Admin")
                {
                    await _userService.ModifyUserRoleAsync(request.UserId, request.NewRole);
                    return Ok("Rol de usuario actualizado correctamente.");
                }
                else
                {
                    return BadRequest("El nuevo rol debe ser User o Admin");
                }
                
            }
            catch (InvalidOperationException)
            {
                return BadRequest("No pudo modificarse el rol del usuario.");
            }
        }

        [Authorize]
        [HttpPut("modifyPassword")]
        public async Task<IActionResult> ModifyPassword([FromBody] NewPasswordDto newPasswordRequest)
        {       

            if(newPasswordRequest == null)
            {
                return BadRequest("La nueva contraseña es nula.");
            }

            // Obtener datos del usuario para modificarse a si mismo
            UserProfileDto userData = await ReadToken();

            if (userData == null)
            {
                Console.WriteLine("Token inválido o usuario no encontrado.");
                return BadRequest("El usuario es null");
            }

            Console.WriteLine($"Usuario autenticado: ID = {userData.UserId}, Email = {userData.Email}");

            try
            {
                await _userService.ModifyPasswordAsync(userData.UserId, newPasswordRequest.newPassword);
                return Ok("Contraseña actualizada correctamente.");
            }
            catch (InvalidOperationException)
            {
                return BadRequest("No pudo modificarse la contraseña.");
            }
        }


        // Elimina un usuario
        [Authorize(Roles = "Admin")]
        [HttpDelete("deleteUser/{userId}")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            try
            {
                await _userService.DeleteUserAsync(userId);

                return Ok("Usuario eliminado correctamente.");
            }
            catch (InvalidOperationException)
            {
                return BadRequest("No pudo eliminarse el usuario");
            }
        }

        // Leer datos del token
        private async Task<UserProfileDto> ReadToken()
        {
            try
            {
                string id = User.Claims.FirstOrDefault().Value;
                User user = await _userService.GetUserByIdAsyncNoDto(Int32.Parse(id));
                UserProfileDto userDto = _userMapper.UserProfileToDto(user);
                return userDto;
            }
            catch (Exception)
            {
                Console.WriteLine("La ID del usuario es null");
                return null;
            }
        }
    }
}
