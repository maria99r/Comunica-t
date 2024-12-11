namespace Ecommerce.Models.Dtos;

// aqui es la busqueda que hago desde el cliente y se la paso al servicio, que hará la consulta 

public class SearchDto
{
    public string consulta { get; set; } // lo que buscas
                                         
    public enum CriterioOrden  
    {
        Name,
        Price
    }
    public CriterioOrden Criterio { get; set; }
    public bool Orden { get; set; } // o tamb enum, asc o desc
    public int CantidadPaginas { get; set; }  
    public int PaginaActual  { get; set; }

}