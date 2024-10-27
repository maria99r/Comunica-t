using Ecommerce.Models.Database.Repositories.Implementations;

namespace Ecommerce.Models.Database
{
    public class UnitOfWork
    {
        private readonly EcommerceContext _context;

        public UserRepository UserRepository { get; init; }
        public ReviewRepository ReviewRepository { get; init; }
        public ProductRepository ProductRepository { get; init; }
        public ProductOrderRepository ProductOrderRepository { get; init; }
        public ProductCartRepository ProductCartRepository { get; init; }
        public CustomerOrderRepository CustomerOrderRepository { get; init; }
        public CartRepository CartRepository { get; init; }

        public UnitOfWork(
            EcommerceContext context, 
            UserRepository userRepository,
            ReviewRepository reviewRepository,
            ProductRepository productRepository,
            ProductOrderRepository productOrderRepository,
            ProductCartRepository productCartRepository,
            CustomerOrderRepository customerOrderRepository,
            CartRepository cartRepository
            )
        {
            _context = context;

            UserRepository = userRepository;
            ReviewRepository = reviewRepository;
            ProductRepository = productRepository;
            ProductOrderRepository = productOrderRepository;
            ProductCartRepository = productCartRepository;
            CustomerOrderRepository = customerOrderRepository;
            CartRepository = cartRepository;
        }

        public async Task<bool> SaveAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
