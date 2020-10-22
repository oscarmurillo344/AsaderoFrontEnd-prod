import { Component, OnInit, AfterViewInit} from '@angular/core';
import { ListaProducto } from "../clases/productos/lista-producto";
import { LocalStorage } from "../clases/local-storage";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { InventarioService } from '../service/inventario.service';
import { Inventario } from '../clases/productos/inventario';
import { TokenServiceService } from '../service/token-service.service';
import { DataService } from '../service/data.service';
import { updatePollo } from '../clases/productos/updatePollo';
import { AppComponent } from '../app.component';



@Component({
  selector: 'app-system-main',
  templateUrl: './system-main.component.html',
  styleUrls: ['./system-main.component.css']
})
export class SystemMainComponent implements OnInit, AfterViewInit  {

  platos:Array<ListaProducto>=new Array();
  bebidas:Array<ListaProducto>=new Array();
  combos:Array<ListaProducto>=new Array();
  porciones:Array<ListaProducto>=new Array();
  carrito:Array<ListaProducto>=new Array();
  productLista:Array<Inventario>=new Array();
  local:LocalStorage=new LocalStorage();
  complete:boolean=false;
  update:updatePollo;
  buscar:string='';
  displayedColumns:string[] = ['agregar', 'Nombre', 'sumar'];
  roles:string[];
  tokens:string;

  constructor(private mensaje:ToastrService,
              private navegacion:Router,
              private __servicioPro:InventarioService,
              private token:TokenServiceService,
              private __data:DataService
              ) 
  {
      this.llenarListas();
      this.roles=this.token.getAuth();
      this.tokens=this.token.getToken();
      this.__data.nombreUsuario=this.token.getUser();
      
    }
   
    ngAfterViewInit() {
      setTimeout(() => {
        this.__data.ver=false;
        this.roles.forEach(data=>{
          if(data==='ROLE_ADMIN'){
           this.__data.ver=true;
          }
        }); 
      });
    }

  ngOnInit() {
    if(this.local.GetStorage('DataCarrito')){
      this.carrito=this.local.GetStorage('DataCarrito');
    }
    if(!this.tokens)
    {
      this.navegacion.navigate(['/login',{}]);
      this.local.RemoveAll()
    }else{
      this.navegacion.navigate(['/inicio',{}]);
    }
    this.__servicioPro.listarpollo().subscribe(data=>{
      if(data.pollo!==undefined){
       this.__data.pollo=data.pollo;
       this.__data.presa=data.presa;
       this.local.SetStorage("pollos",new updatePollo(this.__data.pollo,this.__data.presa));
      }else{
       this.__data.pollo=0;
       this.__data.pollo=0;
       this.local.SetStorage("pollos",new updatePollo(0,0));
      }
     },error=>{
       console.log(error);
       this.local.SetStorage("pollos",new updatePollo(0,0));
     });

  }

  llenarListas()
  {
    this.productLista=this.local.GetStorage("listaProducto");
    if(this.productLista){
      this.productLista=this.local.GetStorage("listaProducto");
      this.llenarTabla(this.productLista);
      this.complete=true;
    }else{  
    this.__servicioPro.listarInventartio().subscribe(data => {
      this.local.SetStorage("listaProducto",data);
     this.productLista=this.local.GetStorage("listaProducto");
     this.llenarTabla(this.productLista);
      this.complete=true;
    },err =>{
      this.mensaje.error("Cargando los productos","Error");
        this.complete=false;
    }
    );
    }
  }

  llenarTabla(data:any){
    for (let index = 0; index < this.productLista.length ;index++) {
      switch (data[index].productoId.tipo) {
        case 'platos':
          this.platos.push(new ListaProducto(data[index].productoId.id,
            data[index].productoId.nombre,
            data[index].productoId.tipo,
            1,
            data[index].cantidadExist,
            data[index].productoId.precio,
            data[index].productoId.presa,
            data[index].extras
            ));
            AppComponent.OrdenarData(this.platos);
          break;
      
        case 'bebidas':
          this.bebidas.push(new ListaProducto(data[index].productoId.id,
            data[index].productoId.nombre,
            data[index].productoId.tipo,
            1,
            data[index].cantidadExist,
            data[index].productoId.precio,
            data[index].productoId.presa,
            data[index].extras
            ));
            AppComponent.OrdenarData(this.bebidas);
          break;
          
        case 'combos':
          this.combos.push(new ListaProducto(data[index].productoId.id,
            data[index].productoId.nombre,
            data[index].productoId.tipo,
            1,
            data[index].cantidadExist,
            data[index].productoId.precio,
            data[index].productoId.presa,
            data[index].extras
            ));
            AppComponent.OrdenarData(this.combos);
          break;
          
        case 'porciones':
          data[index].cantidad=1;
          this.porciones.push(new ListaProducto(data[index].productoId.id,
            data[index].productoId.nombre,
            data[index].productoId.tipo,
            1,
            data[index].cantidadExist,
            data[index].productoId.precio,
            data[index].productoId.presa,
            data[index].extras
            ));
            AppComponent.OrdenarData(this.porciones);
          break;
      }        
    }
  }

  sumar(val,plato){

     switch (plato) {
       case 'platos':
        this.platos[val].cantidad++; 
         break;
       case 'bebidas':
        this.bebidas[val].cantidad++; 
       break;
       case 'combos':
        this.combos[val].cantidad++; 
        break;
        case 'porciones':
          this.porciones[val].cantidad++; 
          break;
     }
    

  }
  restar(val,pla){
    switch (pla) {
      case 'platos':
        if(this.platos[val].cantidad > 1){
          this.platos[val].cantidad--; 
        }
        break;
      case 'bebidas':
        if(this.bebidas[val].cantidad > 1){
          this.bebidas[val].cantidad--; 
        }
      break;
      case 'combos':
        if(this.combos[val].cantidad > 1){
          this.combos[val].cantidad--;
        }
        
       break;
       case 'porciones':
         if(this.porciones[val].cantidad > 1){
          this.porciones[val].cantidad--; 
        }
         break;
          }
  }

  AgregarCarrito(index,tipo){

    switch (tipo) {
      case 'platos': 
          if(this.verificar(index,tipo)){
            this.carrito.push(this.platos[index]);
          }
          if(this.platos[index].cantidadExiste <= 0){
            this.mensaje.warning('Actualice inventario de'+this.platos[index].nombre,'Advertencia');
          }else{
            this.mensaje.success('Se agrego '+this.platos[index].nombre+' al carrito','Exitoso');
          }
        
                
        break;
    
      case 'bebidas':
        if(this.verificar(index,tipo)){
          this.carrito.push(this.bebidas[index]);
        }
        if(this.bebidas[index].cantidadExiste <= 0){
          this.mensaje.warning('Actualice inventario de'+this.bebidas[index].nombre,'Advertencia');
        }else{
          this.mensaje.success('Se agrego '+this.bebidas[index].nombre+' al carrito','Exitoso');
        }     
        
        break;

      case 'combos':
        if(this.verificar(index,tipo)){
          this.carrito.push(this.combos[index]);
        }

        if(this.combos[index].cantidadExiste <= 0){
          this.mensaje.warning('Actualice inventario de'+this.combos[index].nombre,'Advertencia');
        }else{
          this.mensaje.success('Se agrego '+this.combos[index].nombre+' al carrito','Exitoso');
        }
        break;

        case 'porciones':
          if(this.verificar(index,tipo)){
            this.carrito.push(this.porciones[index]);
          }

          if(this.porciones[index].cantidadExiste <= 0){
            this.mensaje.warning('Actualice inventario de'+this.porciones[index].nombre,'Advertencia');
          }else{
            this.mensaje.success('Se agrego '+this.porciones[index].nombre+' al carrito','Exitoso');
          }
          break;
    }
       this.local.SetStorage('DataCarrito',this.carrito);

  }
   
  verificar(i,tipo):boolean
  {
    let val:boolean=true;
    if(this.local.GetStorage("DataCarrito")){
      switch (tipo) {
        case 'platos':
          this.carrito.forEach(car => {
           if(car.nombre===this.platos[i].nombre){
             car.cantidad+=this.platos[i].cantidad;
             val=false;
             this.local.SetStorage('DataCarrito',this.carrito);
           }
          });
          break;
      
        case 'bebidas':
     this.carrito.forEach(car => {
      if(car.nombre===this.bebidas[i].nombre){
        car.cantidad+=this.bebidas[i].cantidad;
        val=false;
        this.local.SetStorage('DataCarrito',this.carrito);
      }
     });
          break;
  
          case 'combos':
            this.carrito.forEach(car => {
              if(car.nombre===this.combos[i].nombre){
                car.cantidad+=this.combos[i].cantidad;
                val=false;
                this.local.SetStorage('DataCarrito',this.carrito);
              }
             });
             break;
          case 'porciones':
            this.carrito.forEach(car => {
              if(car.nombre===this.porciones[i].nombre){
                car.cantidad+=this.porciones[i].cantidad;
                val=false;
                this.local.SetStorage('DataCarrito',this.carrito);
              }
             });
             break;
      }
    }
    return val;
  }
}
