import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Factura } from '../clases/factura/factura';
import { PagarService } from '../service/pagar.service';

@Component({
  selector: 'app-last-sold',
  templateUrl: './last-sold.component.html',
  styleUrls: ['./last-sold.component.css']
})
export class LastSoldComponent implements OnInit {

  ListaFactura:Array<Factura>=new Array();;
  displayedColumns=['Nombre','Cantidad','Fecha','Hora'];
  numeroFact:number=0;
  bloqueo:boolean;
  constructor(
    private __servicioPago:PagarService,
    private toast:ToastrService,
    private route:Router
  ) { 
    this.bloqueo=true;
  }

  ngOnInit() {
  }

  buscar(){
    if(this.numeroFact!==0){
      this.__servicioPago.listar(this.numeroFact).subscribe(
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
      this.__servicioPago.eliminar(this.numeroFact).subscribe(data=>{
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
