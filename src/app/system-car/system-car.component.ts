import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListaProducto } from "../clases/productos/lista-producto";
import { PagarService } from '../service/pagar.service';
import { ToastrService } from 'ngx-toastr';
import { Factura } from '../clases/factura/factura';
import { TokenServiceService } from '../service/token-service.service';
import { Mensaje } from '../clases/mensaje';
import { Producto } from '../clases/productos/producto';
import { Router } from '@angular/router';
import { updatePollo } from '../clases/productos/updatePollo';
import { InventarioService } from '../service/inventario.service';
import { DataService } from '../service/data.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { LocalstorageService } from '../service/localstorage.service';

@Component({
  selector: 'app-system-car',
  templateUrl: './system-car.component.html',
  styleUrls: ['./system-car.component.css']
})
export class SystemCarComponent implements OnInit,OnDestroy {

   total:number;
   valor:number;
   lista:Array<ListaProducto>=new Array()
   factura:Factura;
   numeroFactura:number
   mms:Mensaje;
   contador:number;
  polloMerca:updatePollo;
  bloqueo:boolean;
  private unsuscribir = new Subject<void>()

  constructor(private __servicioPagar:PagarService, 
    private mensaje:ToastrService,
    private token:TokenServiceService,
    private route:Router,
    private __serviceInven:InventarioService,
    private __Data:DataService,
    private local:LocalstorageService) {
   }

  ngOnInit() {
  this.verificarCarrito();
   this.bloqueo=false;
   this.numeroFactura=this.local.GetStorage("nfactura") as number
   if(this.numeroFactura==undefined){
    this.__servicioPagar.maximoValor()
    .pipe(takeUntil(this.unsuscribir))
    .subscribe((data:number)=>{
      this.numeroFactura=data;
      this.numeroFactura+=1;
      this.local.SetStorage("nfactura",this.numeroFactura)
     },error=>this.numeroFactura=0)
   }
   this.diaSemana();
  }

  ngOnDestroy(): void {
    this.unsuscribir.next();
    this.unsuscribir.complete();
  }

  public Facturar():void{
    
    if(this.lista.length > 0)
    {
      this.contador=this.lista.length-1;
      this.polloMerca=this.local.GetStorage("pollos");
      let count=0;
      if( this.polloMerca.pollo > 0){
        this.bloqueo=true;
        for (let index = 0; index < this.lista.length; index++)
         {
          this.factura=new Factura(
            this.numeroFactura,
            new Date(),
            this.token.getUser(),
            this.diaSemana(),
            new Producto(this.lista[index].id,this.lista[index].nombre,
              this.lista[index].tipo,
              this.lista[index].precio,this.lista[index].presa),
            this.lista[index].cantidad,
            this.lista[index].extra);
          this.__servicioPagar.pagar(this.factura)
          .pipe(takeUntil(this.unsuscribir))
          .subscribe(data=>{
            this.mms=data;
            //validacion de pollos y presas con la vista
            count=this.lista[index].presa*this.lista[index].cantidad;
            while (this.polloMerca.presa <= count) {
              this.polloMerca.pollo--;
              this.polloMerca.presa+=8;
            }
              this.polloMerca.presa-=count;
              //fin
            if(index === this.contador){
              this.mensaje.success(this.mms.mensaje,"Exitoso");
              this.local.RemoveStorage('DataCarrito');
              this.__serviceInven.TablePollo(this.polloMerca).subscribe(data=>null);
              this.local.SetStorage("pollos",this.polloMerca)
              this.local.SetStorage("nfactura",this.numeroFactura+1)
              this.__Data.notification.emit(1)
              this.route.navigate(['/inicio'])
              this.bloqueo=false;
            }
          },error=>{
            if(error.error.mensaje===undefined){
              this.mensaje.error("Pago no realizado","Error");
            }else{
              this.mensaje.error(error.error.mensaje,"Error");
            }
            this.bloqueo=false;
          });
         }
      }else{
        this.mensaje.error("No existen pollos","Error");
      }
    }else{
      this.mensaje.error("No existe productos en el carrito","Error");
    }
  }
    verificarCarrito()
    {
    if(this.local.GetStorage('DataCarrito') != null)
    {
      this.lista=this.local.GetStorage('DataCarrito');
      this.total=0;this.valor=0;
      
      for(var i=0;i<this.lista.length;i++){
        this.total+=this.lista[i].cantidad;
        this.valor+=(this.lista[i].precio*this.lista[i].cantidad);
      }
    }else{
      this.total=0;this.valor=0;
    }

   }
    Eliminar(index){
      this.lista.splice(index,1);
      this.local.SetStorage('DataCarrito',this.lista);
      this.verificarCarrito();
      this.__Data.notification.emit(1);
    }
    sumar(i){
      this.lista[i].cantidad++;
      this.local.SetStorage('DataCarrito',this.lista);
      this.verificarCarrito();
      this.__Data.notification.emit(1);
    }
    restar(i){
      if(this.lista[i].cantidad > 1){
        this.lista[i].cantidad--;
        this.local.SetStorage('DataCarrito',this.lista);
        this.verificarCarrito();
        this.__Data.notification.emit(1);
      }
    }

    wentLastControl(){
      this.route.navigate(["/lastsold"]);
    }

    public diaSemana():string{
    let fecha=new Date()
     let dia=new DatePipe("es")
     return dia.transform(fecha,"EEEE")
    }
}
