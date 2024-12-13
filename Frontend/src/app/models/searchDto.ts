export interface SearchDto{
    consulta: string; 
    Criterio: CriterioOrden; 
    Orden: boolean;   // true asc, false desc
    PaginaActual: number; 
  }

  export enum CriterioOrden {
    Name = 0, 
    Price = 1
}