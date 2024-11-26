using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Dtos;
using Ecommerce.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Stripe.Checkout;

namespace Ecommerce.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CheckoutController : ControllerBase
    {
        private readonly IOptions<Settings> _settings;
        private readonly Services.CheckoutService _checkOutService;
        private readonly CartService _cartService;
        private readonly UserService _userService;
        public CheckoutController(IOptions<Settings> settings, Services.CheckoutService checkOutService, CartService cartService, UserService userService)
        {
            _settings = settings;
            _checkOutService = checkOutService;
            _cartService = cartService;
            _userService = userService;
        }

        [Authorize]
        [HttpGet("embedded")]
        public async Task<ActionResult> EmbededCheckout()
        {
            // Obtener id de usuario desde el Token
            UserDto user = await ReadToken();

            if (user == null)
            {
                return BadRequest("El usuario es null");
            }

            var lineItems = new List<SessionLineItemOptions>();

            // Hay que importar los productos
            CartDto cart = await _cartService.GetByUserIdAsync(user.UserId);

            foreach (ProductCart productCart in cart.Products)
            {
                lineItems.Add( new SessionLineItemOptions()
                {
                    PriceData = new SessionLineItemPriceDataOptions()
                    {
                        Currency = "eur",
                        UnitAmount = (long)(productCart.Product.Price),
                        ProductData = new SessionLineItemPriceDataProductDataOptions()
                        {
                            Name = productCart.Product.Name,
                            Description = productCart.Product.Description,
                            Images = [productCart.Product.Image]
                        }
                    },
                    Quantity = productCart.Quantity,
                });
            }

            // Configuración de la sesión
            SessionCreateOptions options = new SessionCreateOptions
            {
                UiMode = "embedded",
                Mode = "payment",
                PaymentMethodTypes = ["card"],
                CustomerEmail = user.Email,
                RedirectOnCompletion = "never",
                LineItems = lineItems
            };

            SessionService service = new SessionService();
            Session session = await service.CreateAsync(options);

            return Ok(new
            {
                clientSecret = session.ClientSecret
            });
        }

        [HttpGet("status/{sessionId}")]
        public async Task<ActionResult> SessionStatus(string sessionId)
        {
            SessionService sessionService = new SessionService();
            Session session = await sessionService.GetAsync(sessionId);

            if (session.PaymentStatus == "paid")
            {
                    //Crear la orden definitiva :(
            }

            //TODO - Crear orden definitiva
            return null;
            //return Ok(new { status = session.Status, customerEmail = session.CustomerEmail });
        }

        // Leer datos del token
        private async Task<UserDto> ReadToken() 
        {
            try
            {
                string id = User.Claims.FirstOrDefault().Value;
                UserDto user = await _userService.GetByIdAsync(Int32.Parse(id));
                return user;
            }
            catch (Exception)
            {
                Console.WriteLine("La ID del usuario es null");
                return null;
            }
        }
    }
}