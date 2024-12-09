using Ecommerce.Helpers;
using Ecommerce.Models.Database;
using Ecommerce.Models.Database.Entities;
using Ecommerce.Models.Database.Repositories.Implementations;
using Ecommerce.Models.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Reflection;

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

    public async Task<(List<Product> Product, int TotalPages)> SearchProductsAsync(SearchDto searchDto)
    {

        var products = await _unitOfWork.ProductRepository.GetAllProductsAsync();

        // filtra si hay consulta
        if (!string.IsNullOrEmpty(searchDto.consulta))
        {
            // usa smart search para buscar aquellos productos que coincidan con la consulta
            var matchedNames = _smartSearchService.Search(searchDto.consulta).ToHashSet();

            Console.WriteLine($"Búsqueda: {searchDto.consulta}, Coincidencias: {string.Join(", ", matchedNames)}");

            products = products.Where(p =>
                matchedNames.Any(name => p.Name.Contains(name, StringComparison.OrdinalIgnoreCase)) ||
                p.Name.Contains(searchDto.consulta, StringComparison.OrdinalIgnoreCase)
                ).ToList();

        }

        if (products.Count == 0)
        {
            return (new List<Product>(), 0); // totalPages será 0 en este caso
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

    // Modificar producto existente
    public async Task ModifyProductAsync(int productId, string newName, int newPrice, int newStock, string newDescription, string newImage)
    {
        var existingProduct = await _unitOfWork.ProductRepository.GetByIdAsync(productId);

        if (existingProduct == null)
        {
            Console.WriteLine("El producto con ID ", productId, " no existe.");
        }
        Console.WriteLine("ID del producto: " + existingProduct.Id);

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
    public async Task<Product> InsertProductAsync(Product product)
    {

        // Verifica si el producto ya existe
        var existingProduct = await GetProductByIdAsync(product.Id);
        if (existingProduct != null)
        {
            throw new Exception("El producto ya existe.");
        }


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
}
