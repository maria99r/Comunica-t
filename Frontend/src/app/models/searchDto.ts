export interface SearchDto{
    consulta: string; 
    Criterio: CriterioOrden; 
    Orden: boolean;   // true asc, false desc
    CantidadPaginas: number; // productos por pagina
    PaginaActual: number; 
  }

  export enum CriterioOrden {
    Name = 0, 
    Price = 1
}