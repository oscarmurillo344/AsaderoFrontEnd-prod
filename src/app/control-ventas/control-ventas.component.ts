import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalStorage } from "../clases/local-storage";
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { PagarService } from '../service/pagar.service';
import { NuevoUsuario } from '../clases/usuarios/nuevoUsuario';
import { VentasDay } from '../clases/VentasDay';
import { ToastrService } from 'ngx-toastr';
import { EntreFecha } from '../clases/factura/EntreFecha';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import { ExportarComponent } from '../Dialogo/exportar/exportar.componentes';
import { GastosService } from '../service/gastos.service';
import { GastosX } from '../clases/gasto/gastosX';
import { Gastos } from '../clases/gasto/gastos';



@Component({
  selector: 'app-control-ventas',
  templateUrl: './control-ventas.component.html',
  styleUrls: ['./control-ventas.component.css']
})

export class ControlVentasComponent implements OnInit {

  @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
  @ViewChild(MatPaginator,{static:false}) paginator2: MatPaginator;

  displayedColumns: string[] = ['No', 'Producto', 'Cantidad','Precio'];
  displayedColumn2: string[] = ['No', 'tipo', 'valor','descripcion','eliminar'];
  dataSource: MatTableDataSource<VentasDay>;
  dataSources: MatTableDataSource<Gastos>;
  tipoForm:FormGroup;
  valor:number=0;
  valorGasto:number=0;
  selected:number=0;
  vista:boolean;
  user:Array<NuevoUsuario>;
  fechas:EntreFecha;
  UserForm:FormGroup;
  fechaForm:FormGroup;
  cerrado:boolean;
  complete:boolean;
  ver:boolean=true;
  gastosx:GastosX;

  constructor(
    private usuario:AuthService,
    private __factura:PagarService,
    private __gastos:GastosService,
    private toast:ToastrService,
    public dialogo:MatDialog
  ) { 
    this.UserForm=this.crearFormMain();
    this.fechaForm=this.crearFormSecond();
    this.tipoForm=this.crearFormThree();
    this.user=new Array();
    this.usuario.ListarUsuario().subscribe(data=>{
      let lista:any=data
      this.user=lista;
    });
    this.complete=true;
  }

  crearFormMain(){
    return  new FormGroup({
      Seleccion: new FormControl('',Validators.required),
      usuario: new FormControl('',Validators.required),
    });
  }
  crearFormSecond(){
    return new FormGroup({
    start:new FormControl(new Date(),Validators.required),
    end: new FormControl(new Date(),Validators.required)
    });
  }
  crearFormThree(){
    return new FormGroup({
      elegir:new FormControl('',Validators.required),
      usuario:new FormControl('',Validators.required),
      start:new FormControl(new Date(),Validators.required),
      end:new FormControl(new Date(),Validators.required)

    });
  }

  cambiar(){
    this.selected=this.selected+1;
  } 

  select(event){
    if(event=='semanas'){
      this.vista=true;
    }else{
      this.vista=false;
    }

  }
  ngOnInit() {
  }
  inicializarPaginator(){
    this.dataSource.paginator=this.paginator;
  }
  getTotalCost(){
    this.valor=0;
    this.dataSource.data.forEach(ele => {
      this.valor=this.valor+(ele.cantidad*ele.precio);
    } );
  }

    ExportarExcel():void{
      if(this.dataSource!==undefined){
        let array:any[]=this.dataSource.data;
        array.forEach(element=>{
          element.precio=element.cantidad*element.precio;
        });
        let respuesta=this.dialogo.open(ExportarComponent,{data:array});
        respuesta.afterClosed().subscribe(data=>{
          if(data==="true"){
            respuesta.close();
          }
        });
      }else{
        this.toast.warning("No existen datos","Advertencia");
      }
    }

  ListarVentas(){
    if(this.UserForm.valid){
      this.cerrado=false;
      this.complete=false;
      if (this.UserForm.value.Seleccion === 'dia' && this.UserForm.value.usuario != 'todos') {
          this.__factura.TotalDay(this.UserForm.value.usuario).subscribe(data=>{
            let d:any=data;
            this.dataSource=new MatTableDataSource(d);
            this.inicializarPaginator();
            this.toast.success("Consulta Exitosa","Exito");
            this.getTotalCost();
            this.cerrado=undefined;
            this.complete=true;
          },error=>{
            if(error.error.mensaje != undefined){
              this.toast.error("Error "+error.error.mensaje,"Error")
            }else{
              this.toast.error("Error en la conulta","Error")
            }
            this.complete=true;
          }
          );
      
      }else {
        if(this.fechaForm.valid){
          this.fechas=new EntreFecha(this.UserForm.value.usuario,
            this.fechaForm.value.start,
            this.fechaForm.value.end)

           if(this.UserForm.value.usuario != 'todos'){
            this.__factura.TotalFechasUser(this.fechas).subscribe(data=>{
              let d:any=data;
              this.dataSource=new MatTableDataSource(d);
              this.inicializarPaginator();
              this.toast.success("Consulta Exitosa","Exito");
              this.getTotalCost();
              this.cerrado=undefined;
              this.complete=true;
              },error=>{
                if(error.error.mensaje != undefined){
                  this.toast.error("Error "+error.error.mensaje,"Error")
                }else{
                  this.toast.error("Error en la conulta","Error")
                }
                this.complete=true;
              }
              );
           }else{
            this.__factura.TotalFechas(this.fechas).subscribe(data=>{
              let d:any=data;
              this.dataSource=new MatTableDataSource(d);
              this.inicializarPaginator();
              this.toast.success("Consulta Exitosa","Exito");
              this.getTotalCost();
              this.cerrado=undefined;
              this.complete=true;
              },error=>{
                if(error.error.mensaje != undefined){
                  this.toast.error("Error "+error.error.mensaje,"Error")
                }else{
                  this.toast.error("Error en la conulta","Error")
                }
                this.complete=true;
              }
              );
           }
        }  
      }
      this.ListarGastos();
    }
  }

  ListarGastos():void{
    this.gastosx=new GastosX
    (this.UserForm.value.usuario,
                              '',
      this.fechaForm.value.start,
      this.fechaForm.value.end);
      this.valorGasto=0;
    if(this.UserForm.value.usuario!=='todos'){
      this.__gastos.listarUserFecha(this.gastosx).subscribe(data=>{
        let datos:any=data;
        this.dataSources=new MatTableDataSource(datos);
        this.inicializarPaginator2();
        this.getTotalCostos();
      });
    }else if(this.UserForm.value.usuario==='todos'){
      this.__gastos.listarFecha(this.gastosx).subscribe(data=>{
        let datos:any=data;
        this.dataSources=new MatTableDataSource(datos);
        this.inicializarPaginator2();
        this.getTotalCostos();
      });
    }
  }

  ListarGastos2(){
    if (this.tipoForm.valid){
      this.complete=false;
      this.cerrado=false;
      this.gastosx=new GastosX(
        this.tipoForm.value.usuario,
        this.tipoForm.value.elegir,
        this.tipoForm.value.start,
        this.tipoForm.value.end
      );
      if(this.tipoForm.value.elegir!=='todo' && this.tipoForm.value.usuario!=='todo'){
        this.__gastos.listarTipoUserFecha(this.gastosx).subscribe(data=>{
          let datos:any=data;
          this.dataSources=new MatTableDataSource(datos);
          this.inicializarPaginator2();
          this.getTotalCostos();
          this.complete=true;
          this.cerrado=undefined;
        });
      }else if(this.tipoForm.value.elegir==='todo' && this.tipoForm.value.usuario!=='todo'){
        this.__gastos.listarUserFecha(this.gastosx).subscribe(data=>{
          let datos:any=data;
          this.dataSources=new MatTableDataSource(datos);
          this.inicializarPaginator2();
          this.getTotalCostos();
          this.complete=true;
          this.cerrado=undefined;
        });
      }else if(this.tipoForm.value.elegir==='todo' && this.tipoForm.value.usuario==='todo'){
        this.__gastos.listarFecha(this.gastosx).subscribe(data=>{
          let datos:any=data;
          this.dataSources=new MatTableDataSource(datos);
          this.inicializarPaginator2();
          this.getTotalCostos();
          this.complete=true;
          this.cerrado=undefined; 
        });
      }
     }
  }
  
  Eliminar(i){
    let id=this.dataSources.data[i].id;
    this.dataSources.data.splice(i,1);
    this.__gastos.Eliminar(id).subscribe(data=>{
      this.toast.success(data.mensaje,"Exitoso");
      this.inicializarPaginator();
      this.getTotalCost();
    },error=>{
      if(error.error.mensaje===undefined){
        this.toast.error("Error en la consulta","Error");
      }else{
        this.toast.error(error.error.mensaje,"Error");
      }
    });
  }
  
  inicializarPaginator2() {
    this.dataSources.paginator = this.paginator2;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if(this.dataSources !== undefined){
      this.dataSources.filter = filterValue.trim().toLowerCase();
      this.getTotalCostos();
      if (this.dataSources.paginator) {
        this.dataSources.paginator.firstPage();
      }
    }
  }

  getTotalCostos(){
    this.valorGasto=0;
    this.dataSources.filteredData.forEach(ele => {
      this.valorGasto=this.valorGasto+ele.valor;
    } );
  }

  
}
