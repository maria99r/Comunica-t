using Ecommerce.Models.Database.Repositories.Implementations;

namespace Ecommerce.Models.Database
{
    public class UnitOfWork
    {
        private readonly EcommerceContext _context;
        private UserRepository _userRepository;
        private ReviewRepository _reviewRepository;
        private ProductRepository _productRepository;
        private ProductOrderRepository _productOrderRepository;
        private ProductCartRepository _productCartRepository;
        private CustomerOrderRepository _customerOrderRepository;
        private CartRepository _cartRepository;

        public UserRepository UserRepository => _userRepository ??= new UserRepository(_context);
        public ReviewRepository ReviewRepository => _reviewRepository ??= new ReviewRepository(_context);
        public ProductRepository ProductRepository => _productRepository ??= new ProductRepository(_context);
        public ProductOrderRepository ProductOrderRepository => _productOrderRepository ??= new ProductOrderRepository(_context);
        public ProductCartRepository ProductCartRepository => _productCartRepository ??= new ProductCartRepository(_context);
        public CustomerOrderRepository CustomerOrderRepository => _customerOrderRepository ??= new CustomerOrderRepository(_context);
        public CartRepository CartRepository => _cartRepository ??= new CartRepository(_context);

        public UnitOfWork(EcommerceContext context)
        {
            _context = context;
        }

        public async Task<bool> SaveAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
