import { Component, OnInit } from '@angular/core';
import { LocalStorage } from "../clases/local-storage";
import { ListaProducto } from "../clases/lista-producto";
import { PagarService } from '../service/pagar.service';
import { ToastrService } from 'ngx-toastr';
import { Factura } from '../clases/factura';
import { TokenServiceService } from '../service/token-service.service';
import { Mensaje } from '../clases/mensaje';
import { Inventario } from '../clases/inventario';
import { Producto } from '../clases/producto';
import { Router } from '@angular/router';
import { updatePollo } from '../clases/updatePollo';
import { InventarioService } from '../service/inventario.service';

@Component({
  selector: 'app-system-car',
  templateUrl: './system-car.component.html',
  styleUrls: ['./system-car.component.css']
})
export class SystemCarComponent implements OnInit {

   local:LocalStorage;
   total:number;
   valor:number;
   lista:Array<ListaProducto>;
   factura:Factura;
   numeroFactura:number;
   mms:Mensaje;
   contador:number;
  polloMerca:updatePollo;
  bloqueo:boolean;

  constructor(private __servicioPagar:PagarService, 
    private mensaje:ToastrService,
    private token:TokenServiceService,
    private route:Router,
    private __serviceInven:InventarioService) {

      this.local=new LocalStorage();
      this.verificarCarrito();
    this.__servicioPagar.maximoValor().subscribe(data=>{
      this.numeroFactura=data;
      this.numeroFactura+=1;
     });
     this.bloqueo=false;
   }

  ngOnInit() {
    
  }
    
  public Facturar(){
    
    if(this.lista.length > -1)
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
            null,
            this.token.getUser(),
            new Producto(this.lista[index].id,this.lista[index].nombre,
              this.lista[index].tipo,
              this.lista[index].precio,this.lista[index].presa),
            this.lista[index].cantidad,
            this.lista[index].extra);
          this.__servicioPagar.pagar(this.factura).subscribe(data=>{
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
              this.__serviceInven.TablePollo(this.polloMerca).subscribe(data=>{});
              this.local.SetStorage("pollos",this.polloMerca)
              this.route.navigate(['/inicio']);
              this.bloqueo=false;
            }
          },error=>{
            if(error.error.mensaje===undefined){
              this.mensaje.success("Pago no realizado","Error");
              console.log(error)
            }else{
              this.mensaje.success(error.error.mensaje,"Error");
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
    }
    sumar(i){
      this.lista[i].cantidad++;
      this.local.SetStorage('DataCarrito',this.lista);
      this.verificarCarrito();
    }
    restar(i){
      if(this.lista[i].cantidad > 1){
        this.lista[i].cantidad--;
        this.local.SetStorage('DataCarrito',this.lista);
        this.verificarCarrito();
      }
    }
}
