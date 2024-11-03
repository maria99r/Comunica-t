namespace Ecommerce.Models.Dtos;

// aqui es la busqueda que hago desde el cliente y se la paso al servicio, que hará la consulta 

public class SearchDto
{
    public string consulta { get; set; } // lo que buscas
    public Enum Criterio { get; set; }  // nombre, precio
    public Boolean Orden { get; set; } // o tamb enum, asc o desc
    public int CantidadPaginas { get; set; }  
    public int PaginaActual  { get; set; }

}

// 1º filtro la consulta
// 2º ordeno la consuta
// 3º pagino y reparto por paginas
// el resultado de la peticion devuelve los productos[] y el total de paginas