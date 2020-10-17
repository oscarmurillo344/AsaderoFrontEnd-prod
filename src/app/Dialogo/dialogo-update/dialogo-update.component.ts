import { Component, OnInit,Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA  } from  '@angular/material/dialog';
import { ProductoListService } from 'src/app/service/producto-list.service';
import { ToastrService } from 'ngx-toastr';
import { Producto } from 'src/app/clases/productos/producto';
import { InventarioService } from 'src/app/service/inventario.service';
import { Inventario } from 'src/app/clases/productos/inventario';
import { LocalStorage } from 'src/app/clases/local-storage';


@Component({
  selector: 'app-dialogo-update',
  templateUrl: './dialogo-update.component.html',
  styleUrls: ['./dialogo-update.component.css']
})
export class DialogoUpdateComponent implements OnInit {

  UpdateProductForm: FormGroup;
  producto:Inventario;
  pro:Producto;
  ListaInventario:Array<Inventario>=new Array();
  local:LocalStorage=new LocalStorage();
  lista:string[]=[];
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data:Inventario,
    private __servicioProduct:ProductoListService,
    private __servicioInventario:InventarioService,
    private mensaje:ToastrService
  ) { 
    this.UpdateProductForm=this.crearForm(data);
    this.producto=data;
  }

  ngOnInit() {
  }
  crearForm(data){
    if(data.extras!==null){
      this.lista=data.extras;
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
      this.__servicioProduct.ActualizarProducto(id,this.pro).subscribe(date=>{
        this.__servicioInventario.UpdateInventario(idd,
          new Inventario(null,
          this.lista.toString(),
          this.UpdateProductForm.value.cantidad,
          this.UpdateProductForm.value.cantidad))
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

}
