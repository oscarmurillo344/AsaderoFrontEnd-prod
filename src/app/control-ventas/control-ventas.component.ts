import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalStorage } from "../clases/local-storage";
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { PagarService } from '../service/pagar.service';
import { NuevoUsuario } from '../clases/nuevoUsuario';
import { VentasDay } from '../clases/VentasDay';
import { ToastrService } from 'ngx-toastr';
import { EntreFecha } from '../clases/EntreFecha';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';



@Component({
  selector: 'app-control-ventas',
  templateUrl: './control-ventas.component.html',
  styleUrls: ['./control-ventas.component.css']
})

export class ControlVentasComponent implements OnInit {

  @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;

  displayedColumns = ['No', 'Producto', 'Cantidad','Precio'];
  dataSource: MatTableDataSource<VentasDay>;
  local:LocalStorage=new LocalStorage();
  valor:number;
  vista:boolean;
  user:Array<NuevoUsuario>
  fechas:EntreFecha;
  UserForm:FormGroup;
  fechaForm:FormGroup;
  cerrado:boolean;

  constructor(
    private usuario:AuthService,
    private factura:PagarService,
    private toast:ToastrService
  ) { 
    this.UserForm=this.crearFormMain();
    this.fechaForm=this.crearFormSecond();
    this.user=new Array();
    this.usuario.ListarUsuario().subscribe(data=>{
      let lista:any=data
      this.user=lista;
    });
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

  ListarVentas(){
    if(this.UserForm.valid){
      this.cerrado=undefined;
      if (this.UserForm.value.Seleccion === 'dia') {
          this.factura.TotalDay(this.UserForm.value.usuario).subscribe(data=>{
            let d:any=data;
            this.dataSource=new MatTableDataSource(d);
            this.inicializarPaginator();
            this.toast.success("Consulta Exitosa","Exito");
            this.getTotalCost();
            this.cerrado=false;
          },error=>{
            if(error.error.mensaje != undefined){
              this.toast.error("Error "+error.error.mensaje,"Error")
            }else{
              this.toast.error("Error en la conulta","Error")
            }
          }
          );
      
      }else {
        if(this.fechaForm.valid){
          this.fechas=new EntreFecha(this.UserForm.value.usuario,
            this.fechaForm.value.start,
            this.fechaForm.value.end)

            this.factura.TotalFechas(this.fechas).subscribe(data=>{
            let d:any=data;
            this.dataSource=new MatTableDataSource(d);
            this.inicializarPaginator();
            this.toast.success("Consulta Exitosa","Exito");
            this.getTotalCost();
            this.cerrado=false;
            },error=>{
              if(error.error.mensaje != undefined){
                this.toast.error("Error "+error.error.mensaje,"Error")
              }else{
                this.toast.error("Error en la conulta","Error")
              }
            }
            );
        }
        
      }
    }
  }

}
