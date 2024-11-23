using Ecommerce.Models.Dtos;
using Ecommerce.Services;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;

//https://docs.stripe.com/checkout/embedded/quickstart

namespace Ecommerce.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CheckOutController : ControllerBase
    {

        private readonly CheckOutService _checkOutService;
        public CheckOutController(CheckOutService checkOutService)
        {
            _checkOutService = checkOutService;
        }

        [HttpGet("CartbyUserId/{id}")]
        public async Task<CartDto> GetCartByUserIdAsync(int id)
        {
            CartDto cartDto = await _checkOutService.GetCartByUserIdAsync(id);

            if (cartDto == null)
            {
                return null;
            }

            return cartDto;
        }

        [HttpGet("TotalPrice/{cartId}")]
        public async Task<double> GetTotalPrice(int cartId)
        {
            double totalPrice = await _checkOutService.GetSumaTotalAsync(cartId);

            return totalPrice;
        }

        [HttpGet("embedded")]
        public async Task<ActionResult> EmbededCheckout()
        {

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
                        Currency = "eur"

                    },

                },
            },
            };

            SessionService service = new SessionService();
            Session session = await service.CreateAsync(options);

            return Ok(new { clientSecret = session.ClientSecret });
        }
    }
}