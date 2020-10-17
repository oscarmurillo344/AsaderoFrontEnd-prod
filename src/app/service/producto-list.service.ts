import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mensaje } from '../clases/mensaje';
import { Producto } from '../clases/productos/producto';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductoListService {

  ProductURL=environment.url+"producto/";

  constructor(private http:HttpClient) { }

  public nuevoProducto(newProduct:Producto): Observable<Mensaje>{
    return this.http.post<Mensaje>(this.ProductURL+'create',newProduct);
  }

  public ListaProducto(): Observable<Producto>{
    return this.http.get<Producto>(this.ProductURL+'lista');
  }

  public EliminarProducto(id:number): Observable<Mensaje>{
    return this.http.delete<Mensaje>(this.ProductURL+'delete/'+id);
  }

  public ActualizarProducto(id:number,producto:Producto): Observable<Mensaje>{
    return this.http.put<Mensaje>(this.ProductURL+'update/'+id,producto);
  }
}
