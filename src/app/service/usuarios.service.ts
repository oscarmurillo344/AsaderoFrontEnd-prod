import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mensaje } from '../clases/mensaje';
import { NuevoUsuario } from '../clases/usuarios/nuevoUsuario';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  ProductURL=environment.url+"auth/";

  constructor(private http:HttpClient) { }

  public nuevoUser(newUser:NuevoUsuario): Observable<Mensaje>{
    return this.http.post<Mensaje>(this.ProductURL+'nuevo',newUser);
  }

  public ListaUser(): Observable<NuevoUsuario>{
    return this.http.get<NuevoUsuario>(this.ProductURL+'listaUsu');
  }

  public EliminarUser(id:number): Observable<Mensaje>{
    return this.http.delete<Mensaje>(this.ProductURL+'deleteuser/'+id);
  }

}
