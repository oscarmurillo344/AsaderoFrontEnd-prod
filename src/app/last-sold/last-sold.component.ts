import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Factura } from '../clases/factura/factura';
import { PagarService } from '../service/pagar.service';

@Component({
  selector: 'app-last-sold',
  templateUrl: './last-sold.component.html'
})
export class LastSoldComponent implements OnInit ,OnDestroy{

  ListaFactura:Array<Factura>;
  displayedColumns=['Nombre','Cantidad','Fecha','Hora'];
  numeroFact:number=0;
  bloqueo:boolean;
  private unsuscribir = new Subject<void>();

  constructor(
    private __servicioPago:PagarService,
    private toast:ToastrService,
    private route:Router
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
        data=>{
            let da:any=data;
            if(da.mensaje===undefined){
            this.ListaFactura=da;
            this.bloqueo=false;
            this.toast.success("factura encontrada","Exitoso");
          }else{
            this.toast.error("factura no encontrada","Exitoso");
          }

        },error=>{
          if(error.error.mensaje===undefined){
            this.toast.error("factura no encontrada","Error");
            console.log(error)
          }else{
            this.toast.error(error.error.mensaje,"Error");
          }
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
      },error=>{
        if(error.error.mensaje===undefined){
          this.toast.error("no eliminado","Error");
        }else{
          this.toast.error(error.error.mensaje,"Error");
        }
        this.bloqueo=false;
      });
    }else{
      this.toast.info("numero no valido","Error");
    }
  }

}
