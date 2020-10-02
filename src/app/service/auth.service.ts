import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NuevoUsuario } from "../clases/nuevoUsuario";
import { LoginUsuario } from "../clases/loginUsuario";
import { Observable } from 'rxjs';
import { jwtDTO } from '../clases/jwt-to';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  ip="https://serviceasadero.herokuapp.com/";
  authURL=this.ip+"auth/";

  constructor(private http:HttpClient) { }

  public nuevoUser(newUser:NuevoUsuario): Observable<any>{
    return this.http.post<any>(this.authURL+'nuevo',newUser);
  }

  public LogIn(login:LoginUsuario): Observable<jwtDTO>{
    return this.http.post<jwtDTO>(this.authURL+'login',login);
  }

  public ListarUsuario(){
    return this.http.get<NuevoUsuario>(this.authURL+'listaUsu');
  }
}

