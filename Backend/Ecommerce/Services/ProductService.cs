using Ecommerce.Models.Database;
using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Dtos;

namespace Ecommerce.Services;

public class ProductService
{
    private readonly UnitOfWork _unitOfWork;
    private readonly SmartSearchService _smartSearchService;

    public ProductService(UnitOfWork unitOfWork, SmartSearchService smartSearchService)
    {
        _unitOfWork = unitOfWork;
        _smartSearchService = smartSearchService;

    }
    public async Task<List<Product>> GetAllProductsAsync()
    {
        return await _unitOfWork.ProductRepository.GetAllProductsAsync();
    }
    public async Task<Product> GetProductByIdAsync(int id)
    {
        return await _unitOfWork.ProductRepository.GetProductById(id);
    }

    public async Task<List<Product>> SearchProductsAsync(SearchDto searchDto)
    {

        var products = await _unitOfWork.ProductRepository.GetAllProductsAsync();

        // filtra si hay consulta
        if (!string.IsNullOrEmpty(searchDto.consulta))
        {
            // usa smart search para buscar aquellos productos que coincidan con la consulta
            var matchedNames = await _smartSearchService.Search(searchDto.consulta);

            //Console.WriteLine($"Búsqueda: {searchDto.consulta}, Coincidencias: {string.Join(", ", matchedNames)}");

            products = products.Where(p =>
                matchedNames.Any(name => p.Name.Contains(name, StringComparison.OrdinalIgnoreCase)) ||
                p.Name.Contains(searchDto.consulta, StringComparison.OrdinalIgnoreCase)
                ).ToList();

        }

        if (products.Count == 0)
        {
            return new List<Product>(); // totalPages será 0 en este caso
        }


        // ordena
        products = searchDto.Orden // true = asc, false = desc
            ? products.OrderBy(p => GetOrderingValue(p, searchDto.Criterio)).ToList()
            : products.OrderByDescending(p => GetOrderingValue(p, searchDto.Criterio)).ToList();

        return (products);

    }

    // metodo para obtener el criterio de orden (si por nombre o por precio)
    private object GetOrderingValue(Product product, SearchDto.CriterioOrden criterio)
    {
        return criterio switch
        {
            SearchDto.CriterioOrden.Name => product.Name,
            SearchDto.CriterioOrden.Price => product.Price,
            _ => product.Name //  por defecto
        };
    }

    // Modificar producto existente
    public async Task ModifyProductAsync(int productId, string newName, int newPrice, int newStock, string newDescription, string newImage)
    {
        var existingProduct = await _unitOfWork.ProductRepository.GetByIdAsync(productId);

        if (existingProduct == null)
        {
            Console.WriteLine("El producto con ID ", productId, " no existe.");
        }
       // Console.WriteLine("ID del producto: " + existingProduct.Id);

        if (!string.IsNullOrEmpty(newName))
        {
            existingProduct.Name = newName;
        }

        if (newPrice > 0)
        {
            existingProduct.Price = newPrice;
        }

        if (newStock > 0)
        {
            existingProduct.Stock = newStock;
        }

        if (!string.IsNullOrEmpty(newDescription))
        {
            existingProduct.Description = newDescription;
        }

        if (!string.IsNullOrEmpty(newImage))
        {
            existingProduct.Image = newImage;
        }

        await UpdateProduct(existingProduct);
        await _unitOfWork.SaveAsync();
    }

    // Crear un nuevo producto
    public async Task<Product> InsertProductAsync(ProductDto product)
    {

        // var relativePath = await SaveImageAsync(product.Image);

        //var maxIdProduct = await _unitOfWork.ProductRepository.GetMaxIdProductAsync();

        /*
        if (maxIdProduct != null) // Asigna el nuevo ID como el mayor ID + 1
        {
            product.Id = maxIdProduct.Id + 1;
        }
        else // Si no hay productos, comienza con 1
        {
            product.Id = 1;
        }


        // Verifica si el producto ya existe
        var existingProduct = await GetProductByIdAsync(product.Id);
        if (existingProduct != null)
        {
            throw new Exception("El producto ya existe.");
        }
        */

        var newProduct = new Product
        {
            Name = product.Name,
            Price = product.Price,
            Stock = product.Stock,
            Description = product.Description,
            Image = product.Image
        };

        await _unitOfWork.ProductRepository.InsertProductAsync(newProduct);
        await _unitOfWork.SaveAsync();

        return newProduct;
    }

    public async Task UpdateProduct(Product product)
    {
        _unitOfWork.ProductRepository.Update(product);
        await _unitOfWork.SaveAsync();
    }

    private async Task<string> SaveImageAsync(CreateUpdateImageRequest imageRequest)
    {
        if (imageRequest?.File == null)
        {
            return null;
        }

        var folderPath = Path.Combine("wwwroot", "products");

        if (!Directory.Exists(folderPath))
        {
            Directory.CreateDirectory(folderPath);
        }

        var uniqueFileName = $"{Guid.NewGuid()}_{imageRequest.File.FileName}";
        var filePath = Path.Combine(folderPath, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await imageRequest.File.CopyToAsync(stream);
        }

        return $"/products/{uniqueFileName}";
    }
}
