import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ProductoListService } from '../service/producto-list.service';
import { ToastrService } from "ngx-toastr";
import { LocalStorage } from "../clases/local-storage";
import {MatDialog} from '@angular/material/dialog';
import { DialogoYesNoComponent } from '../Dialogo/dialogo-yes-no/dialogo-yes-no.component';
import { DialogoUpdateComponent } from '../Dialogo/dialogo-update/dialogo-update.component';
import { Producto } from '../clases/producto';
import { InventarioService } from "../service/inventario.service";
import { Inventario } from '../clases/inventario';
import { ListaProducto } from '../clases/lista-producto';


@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {

  ProductForm :FormGroup;
  BuscarProductForm: FormGroup;
  ProductoArray:Array<ListaProducto>=new Array();
  ListaInventario:Array<Inventario>=new Array();
  ListaProducto:Array<Producto>=new Array();
  local:LocalStorage=new LocalStorage();
  product:Producto;
  nombreBuscar:string;
  displayedColumns: string[] = ['Nombre', 'Cantidad','Editar', 'Eliminar'];

  constructor(
    private __servicioProduct:ProductoListService,
    private mensaje:ToastrService,
    public dialog: MatDialog,
    private __inventarioService:InventarioService
    ) { 
    this.cargarCantidad();
    this.ProductForm=this.createForm();
    this.nombreBuscar='';
  }

  ngOnInit() {
    this.cargarCantidad();
  }
 
  cargarCantidad(){
    this.__inventarioService.listarInventartio().subscribe(da=>
      {this.local.SetStorage("listaProducto",da);
       this.ListaInventario=this.local.GetStorage("listaProducto")});
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
      this.__inventarioService.ingresarInventario(new Inventario(this.product,0,0)).subscribe(d=>{
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
        this.mensaje.error(error.error.mensaje,"Error",
      {
        timeOut:1500,
        positionClass:'toast-top-center'
      });
      
      });
      
    }
  }

  public Editar(index):void{
    let result=this.dialog.open(DialogoUpdateComponent,{data:this.ListaInventario[index]});
    result.afterClosed().subscribe(data =>{
        this.cargarCantidad();
    });
  }

  public Eliminar(index):void{
    let resultado=this.dialog.open(DialogoYesNoComponent,{data:{nombre:this.ListaInventario[index].productoId.nombre}});
   resultado.afterClosed().subscribe(result=>{
    if(result=='true'){
        this.__inventarioService.EliminarInventario(this.ListaInventario[index].id).subscribe(data =>{
        this.mensaje.success(data.mensaje,"Exitoso");
       this.cargarCantidad();
      },error =>{
        this.mensaje.error(error.error.mensaje,"Error");
      }
      );
    }else{
      resultado.close();
    }
   });
    
  }
}
