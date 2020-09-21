import { Injectable } from '@angular/core';
import { LocalStorage } from '../clases/local-storage';
import { TokenServiceService } from './token-service.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  nombreUsuario:string='default';
  pollo:number=0;
  presa:number=0;
  ver:boolean=false;

  constructor() { 
  }
}
