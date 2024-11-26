using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Dtos;
using Ecommerce.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Stripe;
using Stripe.Checkout;
using Stripe.Climate;

//https://docs.stripe.com/checkout/embedded/quickstart

namespace Ecommerce.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CheckoutController : ControllerBase
    {
        private readonly IOptions<Settings> _settings;
        private readonly Services.CheckoutService _checkOutService;
        private readonly CartService _cartService;
        public CheckoutController(IOptions<Settings> settings, Services.CheckoutService checkOutService, CartService cartService)
        {
            _settings = settings;
            _checkOutService = checkOutService;
            _cartService = cartService;
        }

        //[HttpGet("CartbyUserId/{id}")]
        //public async Task<CartDto> GetCartByUserIdAsync(int id)
        //{
        //    CartDto cartDto = await _cartService.GetByUserIdAsync(id);

        //    if (cartDto == null)
        //    {
        //        return null;
        //    }

        //    return cartDto;
        //}

        [HttpGet("TotalPrice/{cartId}")]
        public async Task<double> GetTotalPrice(int cartId)
        {
            double totalPrice = await _checkOutService.GetSumaTotalAsync(cartId);

            return totalPrice;
        }

        [HttpGet("embedded")]
        public async Task<ActionResult> EmbededCheckout(int userId)
        {
            // Obtener id de usuario desde el Token
            //int userId = 

            // Hay que importar los productos

            // hay que coger los productos de la orden temporal, no del carrito
            CartDto cart = await _cartService.GetByUserIdAsync(3); // Está mal, puse como ejemplo una ID random para comprobar que funcione

            foreach (ProductCart productCart in cart.Products)
            {
                // Configuración de la sesión
                SessionCreateOptions options = new SessionCreateOptions
                {
                    UiMode = "embedded",
                    Mode = "payment",
                    PaymentMethodTypes = ["card"],
                    LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions()
                    {
                        PriceData = new SessionLineItemPriceDataOptions()
                        {
                            Currency = "eur",
                            UnitAmount = (long)(productCart.Product.Price * 100),
                                ProductData = new SessionLineItemPriceDataProductDataOptions()
                                {
                                    Name = productCart.Product.Name,
                                    Description = productCart.Product.Description,
                                    Images = [productCart.Product.Image]
                                }
                            },
                        Quantity = 1,
                    },
                },
                    CustomerEmail = "correo_cliente@correo.es",
                    //ReturnUrl = _settings.ClientBaseUrl + "/checkout?session_id={CHECKOUT_SESSION_ID}",
                    RedirectOnCompletion = "never"
                };

                SessionService service = new SessionService();
                Session session = await service.CreateAsync(options);

                return Ok(new { clientSecret = session.ClientSecret });
            }
            return Ok();
        }

        [HttpGet("status/{sessionId}")]
        public async Task<ActionResult> SessionStatus(string sessionId)
        {
            SessionService sessionService = new SessionService();
            Session session = await sessionService.GetAsync(sessionId);

            return Ok(new { status = session.Status, customerEmail = session.CustomerEmail });
        }
    }
}