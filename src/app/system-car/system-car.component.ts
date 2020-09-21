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
   fecha:Date;
   factura:Factura;
   numeroFactura:number;
   mms:Mensaje;
   contador:number;
  constructor(private __servicioPagar:PagarService, 
    private mensaje:ToastrService,
    private token:TokenServiceService,
    private route:Router) {
      this.local=new LocalStorage();
      this.verificarCarrito();
    this.__servicioPagar.maximoValor().subscribe(data=>{
      this.numeroFactura=data;
      this.numeroFactura+=1;
     });
   }

  ngOnInit() {
    
  }
    
  public Facturar(){
    
    if(this.lista.length > -1){
      this.contador=this.lista.length-1;
     for (let index = 0; index < this.lista.length; index++) {
      this.fecha=new Date();
      this.factura=new Factura(
        this.numeroFactura,
        this.fecha,
        this.token.getUser(),
        new Producto(this.lista[index].id,this.lista[index].nombre,
          this.lista[index].tipo,
          this.lista[index].precio,this.lista[index].presa),
        this.lista[index].cantidad);
      this.__servicioPagar.pagar(this.factura).subscribe(data=>{
        this.mms=data;
        
        if(index === this.contador){
          this.mensaje.success(this.mms.mensaje,"Exitoso");
          this.local.RemoveStorage('DataCarrito');
          this.route.navigate(['/inicio']);
        }
      },error=>{
        this.mensaje.success(error.error.mensaje,"Error");
      });
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
