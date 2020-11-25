import { Component, OnInit,ViewChild,Input, OnDestroy} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Gastos } from 'src/app/clases/gasto/gastos';
import { GastosX } from 'src/app/clases/gasto/gastosX';
import { NuevoUsuario } from 'src/app/clases/usuarios/nuevoUsuario';
import { GastosService } from 'src/app/service/gastos.service';

@Component({
  selector: 'app-tablegastos',
  templateUrl: './tablegastos.component.html',
  styleUrls: ['./tablegastos.component.css']
})
export class TablegastosComponent implements OnInit,OnDestroy {

  @ViewChild(MatPaginator,{static:false}) paginatorGastos:MatPaginator;
  @Input()  DataGastos: MatTableDataSource<Gastos>;
  @Input()  user:Array<NuevoUsuario>;
  valorGasto:number=0;
  GastosColumns: string[] = ['No', 'tipo', 'valor','descripcion','eliminar'];
  cerrado:boolean;
  complete:boolean;
  tipoForm:FormGroup;
  gastosx:GastosX;
  private unsuscribir = new Subject<void>();

  constructor(
    private __gastos:GastosService,
    private toast:ToastrService,
    public dialogo:MatDialog
  ) {
    this.tipoForm=this.crearFormThree();
    this.complete=true;
    this.__gastos.listen().subscribe(data=>{
      this.inicializarPaginatorGastos();
      this.getTotalCostosGastos();
    });
   }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsuscribir.next();
    this.unsuscribir.complete();
  }

  crearFormThree():FormGroup{
    return new FormGroup({
      elegir:new FormControl('',Validators.required),
      usuario:new FormControl('',Validators.required),
      start:new FormControl(new Date(),Validators.required),
      end:new FormControl(new Date(),Validators.required)

    });
  }
  inicializarPaginatorGastos():void {
   setTimeout(()=> this.DataGastos.paginator = this.paginatorGastos );
  }

  applyFilter(event: Event):void{
    const filterValue = (event.target as HTMLInputElement).value;
    if(this.DataGastos !== undefined){
      this.DataGastos.filter = filterValue.trim().toLowerCase();
      this.getTotalCostosGastos();
      if (this.DataGastos.paginator) {
        this.DataGastos.paginator.firstPage();
      }
    }
  }

  getTotalCostosGastos():void{
   setTimeout(()=>{
    this.valorGasto=0;
    this.DataGastos.filteredData.forEach(ele => {
      this.valorGasto=this.valorGasto+ele.valor;
    } );  
   });
  }

  ListarGastos2():void{
    if (this.tipoForm.valid){
      this.complete=false;
      this.cerrado=false;
      this.gastosx=new GastosX(
        this.tipoForm.value.usuario,
        this.tipoForm.value.elegir,
        this.tipoForm.value.start,
        this.tipoForm.value.end
      );
      if(this.tipoForm.value.elegir !== 'todo' && this.tipoForm.value.usuario !=='todo'){
        this.__gastos.listarTipoUserFecha(this.gastosx).
        pipe( takeUntil(this.unsuscribir)).
        subscribe(data=>{
          let datos:any=data;
          this.DataGastos=new MatTableDataSource(datos);
          this.inicializarPaginatorGastos();
          this.getTotalCostosGastos();
          this.complete=true;
          this.cerrado=undefined;
        });
      }else if(this.tipoForm.value.elegir ==='todo' && this.tipoForm.value.usuario !=='todo'){
        this.__gastos.listarUserFecha(this.gastosx).
        pipe( takeUntil(this.unsuscribir)).
        subscribe(data=>{
          let datos:any=data;
          this.DataGastos=new MatTableDataSource(datos);
          this.inicializarPaginatorGastos();
          this.getTotalCostosGastos();
          this.complete=true;
          this.cerrado=undefined;
        });
      }else if(this.tipoForm.value.elegir==='todo' && this.tipoForm.value.usuario==='todo'){
        this.__gastos.listarFecha(this.gastosx).
        pipe( takeUntil(this.unsuscribir))
        .subscribe(data=>{
          let datos:any=data;
          this.DataGastos=new MatTableDataSource(datos);
          this.inicializarPaginatorGastos();
          this.getTotalCostosGastos();
          this.complete=true;
          this.cerrado=undefined; 
        });
      }else if(this.tipoForm.value.elegir !=='todo' && this.tipoForm.value.usuario==='todo'){
        this.__gastos.ListarTipoFecha(this.gastosx).
        pipe( takeUntil(this.unsuscribir)).
        subscribe(data=>{
          let datos:any=data;
          this.DataGastos=new MatTableDataSource(datos);
          this.inicializarPaginatorGastos();
          this.getTotalCostosGastos();
          this.complete=true;
          this.cerrado=undefined;
        });
      }
     }
  }
  
  Eliminar(i:number):void{
    try {
      let nuevo:number;
    if(this.DataGastos.paginator.pageIndex !==0){
       nuevo= Math.abs(this.DataGastos.paginator.pageSize+i);
    }else{
       nuevo=i;
    }
    let id=this.DataGastos.filteredData[nuevo].id;
    this.DataGastos.filteredData.splice(nuevo,1);
    this.__gastos.Eliminar(id).
    pipe( takeUntil(this.unsuscribir)).
    subscribe(data=>{
      this.toast.success(data.mensaje,"Exitoso");
      this.inicializarPaginatorGastos();
      this.getTotalCostosGastos();
    },error=>{
      if(error.error.mensaje===undefined){
        this.toast.error("Error en la consulta","Error");
      }else{
        this.toast.error(error.error.mensaje,"Error");
      }
    });
    } catch (error) {
      console.log(error)
    }
    
  }
}
