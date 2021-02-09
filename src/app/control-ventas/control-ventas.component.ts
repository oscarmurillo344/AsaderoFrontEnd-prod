import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { PagarService } from '../service/pagar.service';
import { NuevoUsuario } from '../clases/usuarios/nuevoUsuario';
import { VentasDay } from '../clases/factura/VentasDay';
import { ToastrService } from 'ngx-toastr';
import { EntreFecha } from '../clases/factura/EntreFecha';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import { ExportarComponent } from '../Dialogo/exportar/exportar.componentes';
import { GastosX } from '../clases/gasto/gastosX';
import { GastosService } from '../service/gastos.service';
import { Gastos } from '../clases/gasto/gastos';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-control-ventas',
  templateUrl: './control-ventas.component.html',
  styleUrls: ['./control-ventas.component.css']
})

export class ControlVentasComponent implements OnInit,OnDestroy  {

  @ViewChild(MatPaginator,{static:false}) paginatorVentas: MatPaginator;
  gastoData:MatTableDataSource<Gastos>;
  VentasColumns: string[] = ['No', 'Producto', 'Cantidad','Precio'];
  DataVentas: MatTableDataSource<VentasDay>;
  valor:number=0;
  selected:number=0;
  vista:boolean;
  user:Array<NuevoUsuario>;
  fechas:EntreFecha;
  UserForm:FormGroup;
  cerrado:boolean;
  complete:boolean=true;
  gastosX:GastosX;
  valorGasto:number=0;
  private unsuscribir = new Subject<void>();
  semana:string[];
  diaSelect:string[]=[];
  constructor(
    private usuario:AuthService,
    private __factura:PagarService,
    private __gastos:GastosService,
    private toast:ToastrService,
    public dialogo:MatDialog
  ) { 
  }

  crearFormMain(){
    return  new FormGroup({
      Seleccion: new FormControl('',Validators.required),
      usuario: new FormControl('',Validators.required),
      start:new FormControl(new Date(),Validators.required),
      end: new FormControl(new Date(),Validators.required)
    });
  }
 
  cambiarVista(){
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
    this.UserForm=this.crearFormMain();
    this.user=new Array();
    this.usuario.ListarUsuario().subscribe(data=>{
      let lista:any=data
      this.user=lista;
    });
    this.semana=['lunes','martes','miercoles','jueves','viernes','sabado','domingo'];
  }
  ngOnDestroy(): void {
    this.unsuscribir.next();
    this.unsuscribir.complete();
  }

  public diaSeleccion(event,i:number):void{
    if(event.checked){
      this.diaSelect.push(event.source.value)
    }else{
      this.diaSelect.forEach((data:string,i:number)=> data==event.source.value ? this.diaSelect.splice(i,1) : null)
    }
  }
    inicializarPaginatorVentas():void{
      setTimeout(()=>this.DataVentas.paginator=this.paginatorVentas);
    }
    getTotalCostVentas():void{
      this.valor=0;
      this.DataVentas.data.forEach(ele => {
        this.valor=this.valor+(ele.cantidad*ele.precio);
      } );
    }

    ExportarExcel():void{
      if(this.DataVentas!==undefined){
        let array:any[]=this.DataVentas.data;
        array.forEach(element=>{
          element.precio=element.cantidad*element.precio;
        });
        let respuesta=this.dialogo.open(ExportarComponent,{data:array});
        respuesta.afterClosed().
        pipe( takeUntil(this.unsuscribir)).
        subscribe(data=>{
          if(data==="true"){
            respuesta.close();
          }
        });
      }else{
        this.toast.warning("No existen datos","Advertencia");
      }
    }

  ListarVentas():void{
    if(this.UserForm.valid){
      this.cerrado=false;
      this.complete=false;
      if (this.UserForm.value.Seleccion === 'dia' && this.UserForm.value.usuario != 'todos') {
          this.__factura.TotalDay(this.UserForm.value.usuario).
          pipe( takeUntil(this.unsuscribir)).
          subscribe(data=>{
            let d:any=data;
            this.DataVentas=new MatTableDataSource(d);
            this.inicializarPaginatorVentas();
            this.toast.success("Consulta Exitosa","Exito");
            this.getTotalCostVentas();
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
          this.fechas=new EntreFecha(this.UserForm.value.usuario,
            this.UserForm.value.start,
            this.UserForm.value.end,this.diaSelect.toString())

           if(this.UserForm.value.usuario != 'todos'){
             if(this.diaSelect.length){
              this.__factura.TotalUserFechaDia(this.fechas).pipe(
                takeUntil(this.unsuscribir)
              ).subscribe((data:VentasDay[])=>{
                this.DataVentas=new MatTableDataSource(data);
                this.inicializarPaginatorVentas();
                this.toast.success("Consulta Exitosa","Exito");
                this.getTotalCostVentas();
                this.cerrado=undefined;
                this.complete=true;
              },error=>{
                if(error.error.mensaje != undefined){
                  this.toast.error("Error "+error.error.mensaje,"Error")
                }else{
                  this.toast.error("Error en la conulta","Error")
                }
                this.complete=true;
              })
             }else{
              this.__factura.TotalFechasUser(this.fechas).
              pipe( takeUntil(this.unsuscribir)).
              subscribe((data:VentasDay[])=>{
                this.DataVentas=new MatTableDataSource(data);
                this.inicializarPaginatorVentas();
                this.toast.success("Consulta Exitosa","Exito");
                this.getTotalCostVentas();
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
                )
             }
           }else{
            if(this.diaSelect){
              this.__factura.TotalFechaDia(this.fechas).pipe(
                takeUntil(this.unsuscribir)
              ).subscribe((data:VentasDay[])=>{
                this.DataVentas=new MatTableDataSource(data);
                this.inicializarPaginatorVentas();
                this.toast.success("Consulta Exitosa","Exito");
                this.getTotalCostVentas();
                this.cerrado=undefined;
                this.complete=true;
              },error=>{
                if(error.error.mensaje != undefined){
                  this.toast.error("Error "+error.error.mensaje,"Error")
                }else{
                  this.toast.error("Error en la conulta","Error")
                }
                this.complete=true;
              })
            }else{
              this.__factura.TotalFechas(this.fechas).
              pipe( takeUntil(this.unsuscribir))
              .subscribe(data=>{
                let d:any=data;
                this.DataVentas=new MatTableDataSource(d);
                this.inicializarPaginatorVentas();
                this.toast.success("Consulta Exitosa","Exito");
                this.getTotalCostVentas();
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
    this.gastosX=new GastosX(
      this.UserForm.value.usuario,
      '',
      this.UserForm.value.start,
      this.UserForm.value.end
    );
    if(this.UserForm.value.usuario === 'todos'){
      this.__gastos.listarFecha(this.gastosX).
      pipe( takeUntil(this.unsuscribir)).
      subscribe((gasto:any)=>{
      this.gastoData= new MatTableDataSource(gasto);
      this.getTotalGastos(gasto);
      this.__gastos.filter("accion");
      },error=>{
        console.log(error)
      });
    }else if(this.UserForm.value.usuario !== 'todos'){
      this.__gastos.listarUserFecha(this.gastosX).
      pipe( takeUntil(this.unsuscribir)).
      subscribe((gasto:any)=>{
        this.gastoData= new MatTableDataSource(gasto);
        this.getTotalGastos(gasto);
        this.__gastos.filter("accion");
      },error=>{
        console.log(error)
      });
    }
    
  }  
  getTotalGastos(Dato:Array<any>):void{
    this.valorGasto=0;
      Dato.forEach(ele => {
      this.valorGasto=this.valorGasto+ele.valor;
    });
  }
  }
