import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  nombreUsuario:string='default';
  pollo:number=0;
  presa:number=0;
  ver:boolean=false;
  notification = new EventEmitter<number>();
  
  constructor() { 
  }
}
