import { Component, OnInit,Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA  } from  '@angular/material/dialog';
import { ProductoListService } from 'src/app/service/producto-list.service';
import { ToastrService } from 'ngx-toastr';
import { Producto } from 'src/app/clases/productos/producto';
import { InventarioService } from 'src/app/service/inventario.service';
import { Inventario } from 'src/app/clases/productos/inventario';
import { LocalStorage } from 'src/app/clases/token/local-storage';
import { AppComponent } from 'src/app/app.component';
import { Subject} from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-dialogo-update',
  templateUrl: './dialogo-update.component.html',
  styleUrls: ['./dialogo-update.component.css']
})
export class DialogoUpdateComponent implements OnInit,OnDestroy {

  UpdateProductForm: FormGroup;
  producto:Inventario;
  pro:Producto;
  ListaInventario:Array<Inventario>=new Array();
  local:LocalStorage=new LocalStorage();
  lista:string[];
  CombInventario:Array<Inventario>;
  private unsuscribir = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:Inventario,
    private __servicioProduct:ProductoListService,
    private __servicioInventario:InventarioService,
    private mensaje:ToastrService
  ) { 
    this.UpdateProductForm=this.crearForm(data);
    this.producto=data;
    this.CombInventario=new Array();
    this.CargarCombo();
  }
 
  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.unsuscribir.next();
    this.unsuscribir.complete();
  }

  crearForm(data){
    if(data.extras!==null){
      let ex:string=data.extras;
      this.lista=ex.split(",")
    }else{
      this.lista=[];
    }

    return new FormGroup({
      nombre: new FormControl(data.productoId.nombre,Validators.required),
      tipo: new FormControl(data.productoId.tipo,Validators.required),
      cantidad:new FormControl(data.cantidad,[Validators.required,Validators.pattern('^[0-9]+')]),
      precio: new FormControl(data.productoId.precio,Validators.required),
      presa: new FormControl(data.productoId.presa,[Validators.required,Validators.pattern('^[0-9]+')])
    });
  }
  ActualizarProduct(){
    if(this.UpdateProductForm.valid){
     let id=this.producto.productoId.id;
     let idd=this.producto.id;
      this.pro=new Producto(id,
        this.UpdateProductForm.value.nombre,this.UpdateProductForm.value.tipo,
        this.UpdateProductForm.value.precio,this.UpdateProductForm.value.presa);
       this.__servicioProduct.ActualizarProducto(id,this.pro)
      //.pipe( takeUntil(this.unsuscribir))
      .subscribe(date=>{
        this.__servicioInventario.UpdateInventario(idd,
          new Inventario(null,
          this.lista.toString(),
          this.UpdateProductForm.value.cantidad,
          this.UpdateProductForm.value.cantidad))
          .pipe( takeUntil(this.unsuscribir))
          .subscribe(re=>{
            this.mensaje.success(date.mensaje+' e '+re.mensaje,"Exitoso");
            this.__servicioInventario.filter('Register click');
          },error=>{
            console.log(error)
            this.mensaje.error(error.error.mensaje,"Error");
          }
          );
      },error=>{
        this.mensaje.error(error.error.mensaje,"Error");
      });
    }
  }
  ValorCambio($event):void{
    if($event.checked)
    this.lista.push(""+$event.source.value);
    else if($event.checked===false)
    this.lista.forEach((data:string,i:number)=> data==$event.source.value ?  this.lista.splice(i,1) : null) 
  }
  CargarCombo():void{
    this.CombInventario=this.local.GetStorage("listaProducto");
    this.CombInventario.forEach((data,index)=>{
      if(data.productoId.tipo=='combos'){
        this.CombInventario.splice(index,1);
      }
     this.estadoProducto(this.lista,data)
    });
    AppComponent.OrdenarData(this.CombInventario);
}
  estadoProducto(ver:string[],data:any):void{
    ver.find((filtro:any)=>{
      if(data.id == filtro){
        return data.estado=true
      }else{
        return data.estado=false
      }
    })
  }
}
