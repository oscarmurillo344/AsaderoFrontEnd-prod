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
import {  Subject, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { takeUntil } from 'rxjs/operators';


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
  private unsuscribir = new Subject<void>();
  
  constructor(
    private mensaje:ToastrService,
    public dialog: MatDialog,
    private __inventarioService:InventarioService
    ) { 
      this.ComboInventario=new Array();
      this.local=new LocalStorage();
      this.cargarCantidad();
      this.__inventarioService.listen().pipe(
        takeUntil(this.unsuscribir)
      ).subscribe((m:any)=>{
      this.cargarCantidad();
      });
    this.ProductForm=this.createForm();
    this.nombreBuscar='';
  }
  ngOnDestroy(): void {
    this.unsuscribir.next();
    this.unsuscribir.complete();
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
   this.__inventarioService.listarInventartio()
   .pipe( takeUntil(this.unsuscribir))
   .subscribe(
      (data:any)=>{
        this.ListaInventario=new MatTableDataSource(data);
        this.local.SetStorage("listaProducto",data);
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
     .pipe( takeUntil(this.unsuscribir))
     .subscribe(d=>{
        this.mensaje.success(d.mensaje,"Exitoso");
      this.ProductForm.reset();
        this.__inventarioService.listarInventartio().
        pipe( takeUntil(this.unsuscribir))
        .subscribe((da:any)=>
          {
            
            this.local.SetStorage("listaProducto",da);
           this.ListaInventario=new MatTableDataSource(da)
          }
           );
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
   resultado.afterClosed().
   pipe( takeUntil(this.unsuscribir))
   .subscribe(result=>{
    if(result=='true'){
        this.__inventarioService.EliminarInventario(this.ListaInventario.filteredData[index].id).
        pipe( takeUntil(this.unsuscribir))
        .subscribe(data =>{
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
