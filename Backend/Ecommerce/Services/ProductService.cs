using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Database.Repositories.Implementations;
using Ecommerce.Models.Dtos;
using System.Reflection;

namespace Ecommerce.Services;

public class ProductService
{
    private readonly ProductRepository _productRepository;
    private readonly SmartSearchService _smartSearchService;

    public ProductService(ProductRepository productRepository, SmartSearchService smartSearchService)
    {
        _productRepository = productRepository;
        _smartSearchService = smartSearchService;

    }
    public async Task<List<Product>> GetAllProductsAsync()
    {
        return await _productRepository.GetAllProductsAsync();
    }


    public async Task<Product> GetProductByIdAsync(int id)
    {
        return await _productRepository.GetProductById(id);
    }

    public async Task<(List<Product> Products, int TotalPages)> SearchProductsAsync(SearchDto searchDto)
    {

        var products = await _productRepository.GetAllProductsAsync();

        // filtra si hay consulta
        if (!string.IsNullOrEmpty(searchDto.consulta))
        {
            // usa smart search para buscar aquellos productos que coincidan con la consulta
            var matchedNames = _smartSearchService.Search(searchDto.consulta).ToHashSet();

            Console.WriteLine($"Búsqueda: {searchDto.consulta}, Coincidencias: {string.Join(", ", matchedNames)}");

            products = products.Where(p =>
            p.Name.Contains(searchDto.consulta, StringComparison.OrdinalIgnoreCase) ||
            matchedNames.Contains(p.Name)).ToList();
        }


        // ordena
        products = searchDto.Orden // true = asc, false = desc
            ? products.OrderBy(p => GetOrderingValue(p, searchDto.Criterio)).ToList()
            : products.OrderByDescending(p => GetOrderingValue(p, searchDto.Criterio)).ToList();



        // paginacion
        var totalItems = products.Count();
        var totalPages = (int)Math.Ceiling(totalItems / (double)searchDto.CantidadPaginas);
        var pagedProducts = products.Skip((searchDto.PaginaActual - 1) * searchDto.CantidadPaginas)
                                    .Take(searchDto.CantidadPaginas)
                                    .ToList();


        return (pagedProducts, totalPages);

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

}
