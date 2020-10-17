import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mensaje } from '../clases/mensaje';
import { Inventario } from '../clases/productos/inventario';
import { updatePollo } from '../clases/productos/updatePollo';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  
  urlInven=environment.url+"inventario/";
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

  public UpdatePollo(id:number,inven:updatePollo):Observable<Mensaje>{
    return this.http.put<Mensaje>(this.urlInven+'updatepollo/'+id,inven);
  }

  public TablePollo(inven:updatePollo):Observable<Mensaje>{
    return this.http.put<Mensaje>(this.urlInven+'pollotable/',inven);  
  }

  public listarpollo():Observable<updatePollo>{
    return this.http.get<updatePollo>(this.urlInven+'pollopresa');
  }

  private _listen=new Subject<any>();
  
    listen():Observable<any>{
    return this._listen.asObservable();
      }

    filter(filterBy:string){
      this._listen.next(filterBy);
    }

}
