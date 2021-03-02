import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import {MatDialog} from '@angular/material/dialog';
import { DialogoYesNoComponent } from '../Dialogo/dialogo-yes-no/dialogo-yes-no.component';
import { DialogoUpdateComponent } from '../Dialogo/dialogo-update/dialogo-update.component';
import { Producto } from '../clases/productos/producto';
import { InventarioService } from "../service/inventario.service";
import { Inventario } from '../clases/productos/inventario';
import { AppComponent } from '../app.component';
import {  forkJoin, Subject, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { takeUntil } from 'rxjs/operators';
import { LocalstorageService } from '../service/localstorage.service';
import { Mensaje } from '../clases/mensaje';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})

export class InventarioComponent implements OnInit,OnDestroy {
  ProductForm :FormGroup;
  ListaInventario:MatTableDataSource<Inventario>;
  ComboInventario:Array<Inventario>=new Array();
  product:Producto;
  displayedColumns: string[] = ['Nombre', 'Cantidad','Editar', 'Eliminar'];
  lista:string[]=[];
  private unsuscribir = new Subject<void>();
  
  constructor(
    private mensaje:ToastrService,
    public dialog: MatDialog,
    private __inventarioService:InventarioService,
    private local:LocalstorageService
    ) { 
  }
  ngOnDestroy(): void {
    this.unsuscribir.next();
    this.unsuscribir.complete();
  }

  ngOnInit() {
    this.ProductForm=this.createForm();
    this.cargarCantidad();
    this.__inventarioService.listen().pipe(takeUntil(this.unsuscribir)
    ).subscribe((m:any)=>this.cargarCantidad())
  }
  
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if(this.ListaInventario !== undefined)this.ListaInventario.filter = filterValue.trim().toLowerCase();
  }

  cargarCantidad(){
   this.__inventarioService.listarInventartio()
   .subscribe((data:Inventario[])=>{
        this.ListaInventario=new MatTableDataSource(data);
        this.local.SetStorage("listaProducto",data);
        this.CargarCombo();
        AppComponent.OrdenarData(this.ListaInventario.filteredData);
      },error=> this.MensajeError(error));
  }
  
  CargarCombo(){
      this.ComboInventario=this.local.GetStorage("listaProducto");
      this.ComboInventario.forEach((data,index)=> data.productoId.tipo=='combos' ? this.ComboInventario.splice(index,1):undefined)
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
    forkJoin(this.__inventarioService.ingresarInventario(new Inventario(this.product,this.lista.toString(),0,0)),
    this.__inventarioService.listarInventartio())
     .subscribe((data:[Mensaje,Inventario[]])=>{
      this.mensaje.success(data[0].mensaje,"Exitoso")
      this.ProductForm.reset();
      AppComponent.OrdenarData(data[1])
      this.local.SetStorage("listaProducto",data[1])
      this.ListaInventario=new MatTableDataSource(data[1])
      },error=>this.MensajeError(error))
    }
  }
  public valueChange($event){
    if($event.checked){
      this.lista.push($event.source.value);
    }else if($event.checked===false){
      this.lista.forEach((data:string,i:number)=> data==$event.source.value ? this.lista.splice(i,1):undefined)
    }
  }

  public Editar(index):void{
    this.dialog.open(DialogoUpdateComponent,{data:this.ListaInventario.data[index]});
  }

  public Eliminar(index):void{
    let resultado=this.dialog.open(DialogoYesNoComponent,
      {data:{nombre:this.ListaInventario.filteredData[index].productoId.nombre,titulo:'producto'}});
   resultado.afterClosed().
   pipe( takeUntil(this.unsuscribir))
   .subscribe(result=>{
    if(result=='true'){
        this.__inventarioService.EliminarInventario(this.ListaInventario.filteredData[index].id).
        pipe( takeUntil(this.unsuscribir))
        .subscribe(data =>{
        this.mensaje.success(data.mensaje,"Exitoso");
       this.cargarCantidad();
      },error => this.MensajeError(error))
    }else{
      resultado.close();
    }
   });
    
  }
  MensajeError(error){
    if(error.error.mensaje!== undefined) this.mensaje.error(error.error.mensaje,"Error")
     else this.mensaje.error("Error en la consulta","Error");
  }
}
