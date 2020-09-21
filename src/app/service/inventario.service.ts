import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mensaje } from '../clases/mensaje';
import { Inventario } from '../clases/inventario';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  urlInven="http://192.168.100.20:8080/inventario/";
  constructor(private http:HttpClient) { }

  public ingresarInventario(inven:Inventario):Observable<Mensaje>{
    return this.http.post<Mensaje>(this.urlInven+'addInventario',inven);
  }
  public listarInventartio():Observable<Inventario>{
    return this.http.get<Inventario>(this.urlInven+'lista');
  }

  public UpdateInventario(id:number,inven:Inventario):Observable<Mensaje>{
    return this.http.put<Mensaje>(this.urlInven+'updateinventario/'+id,inven);
  }

  public EliminarInventario(id:number):Observable<Mensaje>{
 return this.http.delete<Mensaje>(this.urlInven+'delete/'+id); 
  }
}
