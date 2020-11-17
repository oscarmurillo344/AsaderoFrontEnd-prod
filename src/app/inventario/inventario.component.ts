import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { LocalStorage } from "../clases/local-storage";
import {MatDialog} from '@angular/material/dialog';
import { DialogoYesNoComponent } from '../Dialogo/dialogo-yes-no/dialogo-yes-no.component';
import { DialogoUpdateComponent } from '../Dialogo/dialogo-update/dialogo-update.component';
import { Producto } from '../clases/productos/producto';
import { InventarioService } from "../service/inventario.service";
import { Inventario } from '../clases/productos/inventario';
import { AppComponent } from '../app.component';
import {  Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})

export class InventarioComponent implements OnInit,OnDestroy {

  ProductForm :FormGroup;
  BuscarProductForm: FormGroup;
  ListaInventario:MatTableDataSource<Inventario>;
  ComboInventario:Array<Inventario>;
  local:LocalStorage;
  product:Producto;
  nombreBuscar:string;
  displayedColumns: string[] = ['Nombre', 'Cantidad','Editar', 'Eliminar'];
  lista:string[]=[];
  undescribe:Subscription;
  filtro:string='';

  constructor(
    private mensaje:ToastrService,
    public dialog: MatDialog,
    private __inventarioService:InventarioService
    ) { 
      this.ComboInventario=new Array();
      this.local=new LocalStorage();
      this.cargarCantidad();
      this.__inventarioService.listen().subscribe((m:any)=>{
      this.cargarCantidad();
      });
    this.ProductForm=this.createForm();
    this.nombreBuscar='';
  }
  ngOnDestroy(): void {
    this.undescribe.unsubscribe();
  }

  ngOnInit() {
    
  }
  
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if(this.ListaInventario !== undefined){
      this.ListaInventario.filter = filterValue.trim().toLowerCase();
    }
  }

  cargarCantidad(){
   this.undescribe=this.__inventarioService.listarInventartio().subscribe(
      data=>{
        let da:any=data;
        this.ListaInventario=new MatTableDataSource(da);
        this.local.SetStorage("listaProducto",da);
        this.CargarCombo();
        AppComponent.OrdenarData(this.ListaInventario.filteredData);
      });
       
  }
  
      CargarCombo(){
          this.ComboInventario=this.local.GetStorage("listaProducto");
          this.ComboInventario.forEach((data,index)=>{
            if(data.productoId.tipo=='combos'){
              this.ComboInventario.splice(index,1);
            }
          });
          AppComponent.OrdenarData(this.ComboInventario);
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
        this.mensaje.error(error.error.mensaje,"Error");
       }else{
        this.mensaje.error("Error en la consulta","Error");
       }
      
      });
      
    }
  }
  public value($event){
    this.lista=[];
  }
  public valueChange($event){
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
    this.dialog.open(DialogoUpdateComponent,{data:this.ListaInventario.data[index]});
  }

  public Eliminar(index):void{
    let resultado=this.dialog.open(DialogoYesNoComponent,
      {data:{nombre:this.ListaInventario.filteredData[index].productoId.nombre,titulo:'producto'}});
   resultado.afterClosed().subscribe(result=>{
    if(result=='true'){
        this.__inventarioService.EliminarInventario(this.ListaInventario.filteredData[index].id).subscribe(data =>{
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
