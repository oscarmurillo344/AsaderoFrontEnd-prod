import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Factura } from '../clases/factura/factura';
import { Mensaje } from '../clases/mensaje';
import { LocalstorageService } from '../service/localstorage.service';
import { PagarService } from '../service/pagar.service';

@Component({
  selector: 'app-last-sold',
  templateUrl: './last-sold.component.html'
})
export class LastSoldComponent implements OnInit{

  ListaFactura:Array<Factura>
  displayedColumns=['Nombre','Cantidad','Fecha','Hora']
  numeroFact:number
  bloqueo:boolean

  constructor(
    private __servicioPago:PagarService,
    private toast:ToastrService,
    private route:Router,
    private local:LocalstorageService
  ) { 
  }

  ngOnInit() {
    this.bloqueo=true
    this.ListaFactura=new Array()
  }
  buscar(){
    if(this.numeroFact!==0){
      this.__servicioPago.listar(this.numeroFact)
      .subscribe((data:any)=>{
        if(data.mensaje===undefined){
            this.ListaFactura=data;
            this.bloqueo=false;
            this.toast.success("factura encontrada","Exitoso");
          }else this.toast.error(data.mensaje,"Exitoso")
        },error=> this.mensajeError(error));
    }else{
      this.toast.info("numero no valido","Error");
    }
  }
  Eliminar(){
    if(this.numeroFact!==0){
      this.__servicioPago.eliminar(this.numeroFact)
      .subscribe((data:Mensaje)=>{
        this.toast.success(data.mensaje,"Exitoso");
        this.bloqueo=false;
        this.route.navigate(["/inicio"]);
        this.local.SetStorage("nfactura",undefined)
      },error=>{
        this.mensajeError(error)
        this.bloqueo=false;
      });
    }else this.toast.info("numero no valido","Error");
  }
  mensajeError(error){
    if(error.error.mensaje===undefined)this.toast.error("no eliminado","Error");
         else this.toast.error(error.error.mensaje,"Error");
  }
}
