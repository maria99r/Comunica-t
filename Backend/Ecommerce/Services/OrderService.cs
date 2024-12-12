using Ecommerce.Models.Database;
using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Dtos;
using Ecommerce.Models.Mappers;
using Ecommerce.Services.Blockchain;
using Ecommerce.Services.Email;

namespace Ecommerce.Services;

public class OrderService
{
    private readonly UnitOfWork _unitOfWork;
    private readonly OrderMapper _orderMapper;
    private readonly IEmailService _emailService;
    private readonly IConfiguration _configuration;

    public OrderService(UnitOfWork unitOfWork, OrderMapper orderMapper, IEmailService emailService, IConfiguration configuration)
    {
        _unitOfWork = unitOfWork;
        _orderMapper = orderMapper;
        _emailService = emailService;
        _configuration = configuration;
    }

    // obtener por id
    public async Task<OrderDto> GetByIdAsync(int id)
    {
        var order = await _unitOfWork.OrderRepository.GetOrderById(id);

        if (order == null)
        {
            return null;
        }

        return _orderMapper.OrderToDto(order);
    }

    // obtener pedidos dto por id de usuario
    public async Task<List<OrderDto>> GetOrderByUser(int id)
    {
        if (id <= 0) throw new ArgumentException("El ID no es válido.");

        var orders = await _unitOfWork.OrderRepository.GetOrderByUser(id);

        if (orders.Count == 0)
        {
            return null;
        }

        var ordersDto = _orderMapper.OrdersToDto(orders).ToList();

        return ordersDto;
    }



    // crear un pedido, elimina orden temporal, ENVIA CORREO A USER
    public async Task<Order> CreateOrderAsync(int idtemporal)
    {
        var t = await _unitOfWork.TemporalOrderRepository.GetTemporalOrderById(idtemporal);

        // creo pedido
        var newOrder = new Order
        {
            UserId = (int)t.UserId,
            PaymentDate = DateTime.Now,
            PaymentMethod = t.PaymentMethod,
            TotalPrice = t.TotalPrice,
            ProductsOrder = new List<ProductOrder>()
            /*
            {
                Quantity = pc.Quantity,
                ProductId = pc.Product.Id,
                PricePay = pc.Product.Price
            }).ToList(),*/
        };

        // agregar productos
        foreach (var pc in t.TemporalProductOrder)
        {
            var product = pc.Product;
            if (product != null)
            {
                var productOrder = new ProductOrder
                {
                    Quantity = pc.Quantity,
                    ProductId = product.Id,
                    PricePay = product.Price,
                };
                newOrder.ProductsOrder.Add(productOrder);
            }
        }

        // guardo pedido
        var order = await _unitOfWork.OrderRepository.InsertAsync(newOrder);

        // Quitas del carrito
        if (!t.Express)
        {
            var cart = await _unitOfWork.CartRepository.GetCartByUserNoDto((int)t.UserId);

            foreach (var item in cart.ProductCarts)
            {
                await _unitOfWork.ProductCartRepository.Delete(item);
            }

        }

        // Elimino la orden temporal para que no restaure el stock con el servicio
        await _unitOfWork.TemporalOrderRepository.Delete(t);

        await _unitOfWork.SaveAsync();

        var serverBaseUrl = _configuration["Settings:ServerBaseUrl"];  // para mostrar las imagenes en el correo

        // precio en ethereum
        decimal totalEthereum = 0;
        var totalEthereumHtml = "";
        if (newOrder.PaymentMethod.Equals("blockchain", StringComparison.OrdinalIgnoreCase))
        {
            CoinGeckoApi coinGeckoApi = new CoinGeckoApi();
            decimal ethInEur = await coinGeckoApi.GetEthereumPriceAsync();
            totalEthereum = newOrder.TotalPrice / 100 / ethInEur;
            totalEthereumHtml = $"<p><strong>Total en Ethereum:</strong> {totalEthereum:F6} ETH</p>";
        }

        // envia correo a user
        var user = await _unitOfWork.UserRepository.GetByIdAsync(newOrder.UserId);
        if (user != null)
        {
            var email = new EmailDto
            {
                To = user.Email,
                Subject = "Confirmación de pedido",
                Body = $@"
                <!DOCTYPE html>
    <html lang=""es"">
    <head>
        <meta charset=""UTF-8"">
        <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
        <style>
            body {{
                line-height: 1.6;
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
            }}
            h1 {{
                color: #2A345D;
            }}
            .product {{
                display: flex;
                margin: 10px 0;
                border-bottom: 1px solid #D1DEFF;
                padding-bottom: 10px;
            }}
            .product img {{
                width:100px;
                height: 100px;
                margin-right: 15px;
            }}
            .product-details {{
                flex: 1;
            }}
            .summary {{
                margin-top: 20px;
            }}
        </style>
    </head>
    <body>
            <h1>¡Gracias por tu compra, {user.Name}!</h1>
            <p>Tu pedido ha sido procesado con éxito.</p>

            <p><strong>ID del pedido:</strong> {order.Id}</p>
            <p><strong>Fecha de pago:</strong> {order.PaymentDate.ToString("f", new System.Globalization.CultureInfo("es-ES"))}</p>
            <p><strong>Dirección de envío:</strong> {user.Address}</p>
            <p><strong>Método de pago:</strong> {order.PaymentMethod}</p>

            <h2>Productos:</h2>
            {string.Join("", order.ProductsOrder.Select(po => $@"
                <div class=""product"">
                    <img src=""{serverBaseUrl}/{po.Product.Image}""/>
                    <div class=""product-details"">
                        <p><strong>{po.Product.Name}</strong></p>
                        <p><strong>Cantidad:</strong> {po.Quantity}</p>
                        <p><strong>Precio unidad:</strong> {po.PricePay / 100}€</p>
                        <p><strong>Subtotal:</strong> {po.PricePay * po.Quantity / 100}€</p>
                    </div>
                </div>
            "))}

            <div class=""summary"">
                <h4><strong>Total:</strong> {order.TotalPrice / 100}€</h4>
            </div>
            {totalEthereumHtml}

            <p>¡Gracias por confiar en Comunica-T!</p>


    </body>
    </html>"
            };
            _emailService.SendEmail(email);
        }

        return order;


    }
    public void UpdateCart(Cart cart)
    {
        _unitOfWork.CartRepository.Update(cart);
    }
}
