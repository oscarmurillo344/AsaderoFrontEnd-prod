import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { LocalStorage } from "../clases/local-storage";
import {MatDialog} from '@angular/material/dialog';
import { DialogoYesNoComponent } from '../Dialogo/dialogo-yes-no/dialogo-yes-no.component';
import { DialogoUpdateComponent } from '../Dialogo/dialogo-update/dialogo-update.component';
import { Producto } from '../clases/productos/producto';
import { InventarioService } from "../service/inventario.service";
import { Inventario } from '../clases/productos/inventario';
import { ListaProducto } from '../clases/productos/lista-producto';


@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})

export class InventarioComponent implements OnInit {

  ProductForm :FormGroup;
  BuscarProductForm: FormGroup;
  ListaInventario:Array<Inventario>;
  ComboInventario:Array<Inventario>;
  local:LocalStorage=new LocalStorage();
  product:Producto;
  nombreBuscar:string;
  displayedColumns: string[] = ['Nombre', 'Cantidad','Editar', 'Eliminar'];
  lista:string[]=[];

  constructor(
    private mensaje:ToastrService,
    public dialog: MatDialog,
    private __inventarioService:InventarioService
    ) { 
      this.ListaInventario=new Array();
      this.ComboInventario=new Array();
      this.cargarCantidad();
      this.__inventarioService.listen().subscribe((m:any)=>{
        this.cargarCantidad();
      });
    this.ProductForm=this.createForm();
    this.nombreBuscar='';
  }

  ngOnInit() {
    
  }
 
  cargarCantidad(){
    this.__inventarioService.listarInventartio().subscribe(
      data=>{
        let da:any=data;
        this.local.SetStorage("listaProducto",data);
        this.CargarCombo();
        this.ListaInventario=da;
        this.ListaInventario.sort(function (o1,o2) {
          if (o1.productoId.nombre > o2.productoId.nombre) { //comparación lexicogŕafica
            return 1;
          } else if (o1.productoId.nombre < o2.productoId.nombre) {
            return -1;
          } 
          return 0;
        });
      });
       
  }
  
      CargarCombo(){
          this.ComboInventario=this.local.GetStorage("listaProducto");
          this.ComboInventario.forEach((data,index)=>{
            if(data.productoId.tipo=='combos'){
              this.ComboInventario.splice(index,1);
            }
          });
          this.ComboInventario.sort(function (o1,o2) {
            if (o1.productoId.nombre > o2.productoId.nombre) { //comparación lexicogŕafica
              return 1;
            } else if (o1.productoId.nombre < o2.productoId.nombre) {
              return -1;
            } 
            return 0;
          });
      }
  createForm(){
    return new FormGroup({
      nombre: new FormControl('',Validators.required),
      tipo: new FormControl('',Validators.required),
      precio: new FormControl('',Validators.required),
      presa: new FormControl('',[Validators.required,Validators.pattern('^[0-9]+')])
    });
  }

  CrearProduct(){
    if(this.ProductForm.valid){
      this.product=new Producto(null,
        this.ProductForm.value.nombre,
        this.ProductForm.value.tipo,
        this.ProductForm.value.precio,
        this.ProductForm.value.presa);
     this.__inventarioService.ingresarInventario(new Inventario(this.product,this.lista.toString(),0,0))
     .subscribe(d=>{
        this.mensaje.success(d.mensaje,"Exitoso",
      {
        timeOut:1500,
        positionClass:'toast-top-center'
      });
      this.ProductForm.reset();
        this.__inventarioService.listarInventartio().subscribe(da=>
          {this.local.SetStorage("listaProducto",da);
           this.ListaInventario=this.local.GetStorage("listaProducto")});
      },error=>{
       if(error.error.mensaje!== undefined){
        this.mensaje.error(error.error.mensaje,"Error",
        {
          timeOut:1500,
          positionClass:'toast-top-center'
        });
       }else{
        this.mensaje.error("Error en la consulta","Error",
        {
          timeOut:1500,
          positionClass:'toast-top-center'
        });
       }
      
      });
      
    }
  }
  value($event){
    this.lista=[];
  }
  valueChange($event){
    if($event.checked){
      this.lista.push($event.source.value);
    }else if($event.checked===false){

      this.lista.forEach((data:string,i:number)=>{
        if(data==$event.source.value){
          this.lista.splice(i,1);
        }
      });
    }
  }

  public Editar(index):void{
    this.dialog.open(DialogoUpdateComponent,{data:this.ListaInventario[index]});
  }

  public Eliminar(index):void{
    let resultado=this.dialog.open(DialogoYesNoComponent,
      {data:{nombre:this.ListaInventario[index].productoId.nombre,titulo:'producto'}});
   resultado.afterClosed().subscribe(result=>{
    if(result=='true'){
        this.__inventarioService.EliminarInventario(this.ListaInventario[index].id).subscribe(data =>{
        this.mensaje.success(data.mensaje,"Exitoso");
       this.cargarCantidad();
      },error =>{
        if(error.error.mensaje!==undefined){
          this.mensaje.error(error.error.mensaje,"Error");
        }else{
          this.mensaje.error("Error en la consulta","Error");
        }
      }
      );
    }else{
      resultado.close();
    }
   });
    
  }
}
