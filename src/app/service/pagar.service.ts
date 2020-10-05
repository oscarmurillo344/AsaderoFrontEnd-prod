import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Factura } from '../clases/factura';
import { Mensaje } from '../clases/mensaje';
import { Observable } from 'rxjs';
import { VentasDay } from '../clases/VentasDay';
import { EntreFecha } from '../clases/EntreFecha';


@Injectable({
  providedIn: 'root'
})
export class PagarService {

  ip="192.168.100.20"
  pagarURL="http://"+this.ip+":8080/factura/";

  constructor(private http:HttpClient) { }

  public pagar(newProduct:Factura): Observable<Mensaje>{
    return this.http.post<Mensaje>(this.pagarURL+'facturar',newProduct);
  }

  public listar(numero:number): Observable<Factura>{
    return this.http.get<Factura>(this.pagarURL+'lista/'+numero);
  }

  public eliminar(numero:number): Observable<Mensaje>{
    return this.http.delete<Mensaje>(this.pagarURL+'delete/'+numero);
  }

  public maximoValor(): Observable<number>{
    return this.http.get<number>(this.pagarURL+'numero');
  }

  public TotalDay(usuario:string):Observable<VentasDay>{
    return this.http.get<VentasDay>(this.pagarURL+'totalDay/'+usuario);
  }

  public TotalFechas(Fecha:EntreFecha):Observable<VentasDay>{
    return this.http.post<VentasDay>(this.pagarURL+'totalfecha',Fecha);
  }

}
