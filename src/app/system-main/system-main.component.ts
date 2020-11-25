import { Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
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
import { Subject } from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import { Directionality } from '@angular/cdk/bidi';
import { takeUntil } from 'rxjs/operators';



@Component({
  selector: 'app-system-main',
  templateUrl: './system-main.component.html',
  styleUrls: ['./system-main.component.css']
})
export class SystemMainComponent implements OnInit, AfterViewInit,OnDestroy  {

  platos2:MatTableDataSource<ListaProducto>;
  bebidas2:MatTableDataSource<ListaProducto>;
  combos2:MatTableDataSource<ListaProducto>;
  porciones2:MatTableDataSource<ListaProducto>;
  platos:Array<ListaProducto>;
  bebidas:Array<ListaProducto>;
  combos:Array<ListaProducto>;
  porciones:Array<ListaProducto>;
  carrito:Array<ListaProducto>;
  productLista:Array<Inventario>;
  local:LocalStorage;
  complete:boolean=false;
  update:updatePollo;
  buscar:string='';
  displayedColumns:string[] = ['agregar', 'Nombre', 'sumar'];
  roles:string[];
  tokens:string;
  private unsuscribir = new Subject<void>();
 
  constructor(private mensaje:ToastrService,
              private navegacion:Router,
              private __servicioPro:InventarioService,
              private token:TokenServiceService,
              private __data:DataService,
              ) 
  {
      this.platos=new Array();
      this.bebidas=new Array();
      this.combos=new Array();
      this.porciones=new Array();
      this.carrito=new Array();
      this.productLista=new Array();
      this.local=new LocalStorage();
      this.llenarListas();
      this.roles=this.token.getAuth();
      this.tokens=this.token.getToken();
      this.__data.nombreUsuario=this.token.getUser();
    }
  ngOnDestroy(): void {
    this.unsuscribir.next();
    this.unsuscribir.complete();
  }
   
    ngAfterViewInit() {
      setTimeout(() => {
        this.__data.ver=false;
        this.roles.forEach(data=>{
          if(data==='ROLE_ADMIN'){
           this.__data.ver=true;
          }
        }); 
        this.__data.notification.emit(1);
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
    this.__servicioPro.listarpollo().
    pipe( takeUntil(this.unsuscribir))
    .subscribe(data=>{
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
       this.local.SetStorage("pollos",new updatePollo(0,0));
     });
  }

  aplicarFilter():void{
    const filterValue=this.buscar;
    if(this.platos2!==undefined){
      this.platos2.filter=filterValue.trim().toLowerCase();
    }
    if(this.bebidas2!==undefined){
      this.bebidas2.filter=filterValue.trim().toLowerCase();
    }
    if(this.combos2!==undefined){
      this.combos2.filter=filterValue.trim().toLowerCase();
    }
    if(this.porciones2!==undefined){
      this.porciones2.filter=filterValue.trim().toLowerCase();
    }
  }

  llenarListas():void
  {
    this.productLista=this.local.GetStorage("listaProducto");
    if(this.productLista){
      this.productLista=this.local.GetStorage("listaProducto");
      this.llenarTabla(this.productLista);
      this.complete=true;
    }else{  
    this.__servicioPro.listarInventartio().
    pipe( takeUntil(this.unsuscribir))
    .subscribe(data => {
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

  llenarTabla(data:any):void{
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
            AppComponent.OrdenarData2(this.platos);
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
            AppComponent.OrdenarData2(this.bebidas);
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
            AppComponent.OrdenarData2(this.combos);
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
            AppComponent.OrdenarData2(this.porciones);
          break;
      }        
    }
    this.platos2=new MatTableDataSource(this.platos);
    this.bebidas2=new MatTableDataSource(this.bebidas);
    this.combos2=new MatTableDataSource(this.combos);
    this.porciones2==new MatTableDataSource(this.porciones);

  }

  sumar(val,plato):void{

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
  restar(val,pla):void{
    switch (pla) {
      case 'platos':
        if(this.platos2.filteredData[val].cantidad > 1){
          this.platos2.filteredData[val].cantidad--; 
        }
        break;
      case 'bebidas':
        if(this.bebidas2.filteredData[val].cantidad > 1){
          this.bebidas2.filteredData[val].cantidad--; 
        }
      break;
      case 'combos':
        if(this.combos2.filteredData[val].cantidad > 1){
          this.combos2.filteredData[val].cantidad--;
        }
        
       break;
       case 'porciones':
         if(this.porciones2.filteredData[val].cantidad > 1){
          this.porciones2.filteredData[val].cantidad--; 
        }
         break;
          }
  }

  AgregarCarrito(index,tipo):void{

    switch (tipo) {
      case 'platos': 
          if(this.verificar(index,tipo)){
            this.carrito.push(this.platos2.filteredData[index]);
          }
          if(this.platos[index].cantidadExiste <= 0){
            this.mensaje.warning('Actualice inventario de '+this.platos2.filteredData[index].nombre,'Advertencia');
          }else{
            this.mensaje.success('Se agrego '+this.platos2.filteredData[index].nombre+' al carrito','Exitoso');
          }
        
                
        break;
    
      case 'bebidas':
        if(this.verificar(index,tipo)){
          this.carrito.push(this.bebidas2.filteredData[index]);
        }
        if(this.bebidas2.filteredData[index].cantidadExiste <= 0){
          this.mensaje.warning('Actualice inventario de '+this.bebidas2.filteredData[index].nombre,'Advertencia');
        }else{
          this.mensaje.success('Se agrego '+this.bebidas2.filteredData[index].nombre+' al carrito','Exitoso');
        }     
        
        break;

      case 'combos':
        if(this.verificar(index,tipo)){
          this.carrito.push(this.combos2.filteredData[index]);
        }

        if(this.combos2.filteredData[index].cantidadExiste <= 0){
          this.mensaje.warning('Actualice inventario de '+this.combos2.filteredData[index].nombre,'Advertencia');
        }else{
          this.mensaje.success('Se agrego '+this.combos2.filteredData[index].nombre+' al carrito','Exitoso');
        }
        break;

        case 'porciones':
          if(this.verificar(index,tipo)){
            this.carrito.push(this.porciones2.filteredData[index]);
          }

          if(this.porciones2.filteredData[index].cantidadExiste <= 0){
            this.mensaje.warning('Actualice inventario de '+this.porciones2.filteredData[index].nombre,'Advertencia');
          }else{
            this.mensaje.success('Se agrego '+this.porciones2.filteredData[index].nombre+' al carrito','Exitoso');
          }
          break;
    }
       this.local.SetStorage('DataCarrito',this.carrito);
       this.__data.notification.emit(1);
  }
   
  verificar(i,tipo):boolean
  {
    let val:boolean=true;
    if(this.local.GetStorage("DataCarrito")){
      switch (tipo) {
        case 'platos':
          this.carrito.forEach(car => {
           if(car.nombre===this.platos2.filteredData[i].nombre){
             car.cantidad+=this.platos2.filteredData[i].cantidad;
             val=false;
             this.local.SetStorage('DataCarrito',this.carrito);
           }
          });
          break;
      
        case 'bebidas':
     this.carrito.forEach(car => {
      if(car.nombre===this.bebidas2.filteredData[i].nombre){
        car.cantidad+=this.bebidas2.filteredData[i].cantidad;
        val=false;
        this.local.SetStorage('DataCarrito',this.carrito);
      }
     });
          break;
  
          case 'combos':
            this.carrito.forEach(car => {
              if(car.nombre===this.combos2.filteredData[i].nombre){
                car.cantidad+=this.combos2.filteredData[i].cantidad;
                val=false;
                this.local.SetStorage('DataCarrito',this.carrito);
              }
             });
             break;
          case 'porciones':
            this.carrito.forEach(car => {
              if(car.nombre===this.porciones2.filteredData[i].nombre){
                car.cantidad+=this.porciones2.filteredData[i].cantidad;
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
