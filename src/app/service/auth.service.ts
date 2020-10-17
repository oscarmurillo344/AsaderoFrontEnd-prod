import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NuevoUsuario } from "../clases/usuarios/nuevoUsuario";
import { LoginUsuario } from "../clases/usuarios/loginUsuario";
import { Observable } from 'rxjs';
import { jwtDTO } from '../clases/jwt-to';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  authURL=environment.url+"auth/";

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

