import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil} from 'rxjs/operators';
import { Factura } from '../clases/factura/factura';
import { updatePollo } from '../clases/productos/updatePollo';
import { LocalstorageService } from '../service/localstorage.service';
import { PagarService } from '../service/pagar.service';

@Component({
  selector: 'app-last-sold',
  templateUrl: './last-sold.component.html'
})
export class LastSoldComponent implements OnInit ,OnDestroy{

  ListaFactura:Array<Factura>
  displayedColumns=['Nombre','Cantidad','Fecha','Hora']
  numeroFact:number
  bloqueo:boolean

  private unsuscribir = new Subject<void>();

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

  ngOnDestroy(): void {
    this.unsuscribir.next();
    this.unsuscribir.complete();
  }
  buscar(){
    if(this.numeroFact!==0){
      this.__servicioPago.listar(this.numeroFact)
      .pipe(takeUntil(this.unsuscribir))
      .subscribe(
        (data:any)=>{
        if(data.mensaje===undefined){
            this.ListaFactura=data;
            this.bloqueo=false;
            this.toast.success("factura encontrada","Exitoso");
          }else this.toast.error(data.mensaje,"Exitoso")
        },error=>{
          if(error.error.mensaje===undefined)this.toast.error("factura no encontrada","Error");
          else this.toast.error(error.error.mensaje,"Error");
        });
    }else{
      this.toast.info("numero no valido","Error");
    }
  }
  Eliminar(){
    if(this.numeroFact!==0){
      this.__servicioPago.eliminar(this.numeroFact)
      .pipe(takeUntil(this.unsuscribir))
      .subscribe(data=>{
        this.toast.success(data.mensaje,"Exitoso");
        this.bloqueo=false;
        this.route.navigate(["/inicio"]);
        this.local.SetStorage("nfactura",undefined)
      },error=>{
        if(error.error.mensaje===undefined)this.toast.error("no eliminado","Error");
         else this.toast.error(error.error.mensaje,"Error");
        this.bloqueo=false;
      });
    }else this.toast.info("numero no valido","Error");
  }
}
