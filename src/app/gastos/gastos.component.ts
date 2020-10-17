import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Gastos } from '../clases/gasto/gastos';
import { AuthService } from '../service/auth.service';
import { GastosService } from '../service/gastos.service';
import { NuevoUsuario } from '../clases/usuarios/nuevoUsuario';
import { TokenServiceService } from '../service/token-service.service';
import { GastosX } from '../clases/gasto/gastosX';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.css']
})
export class GastosComponent implements OnInit {

  @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;

  dataSource: MatTableDataSource<Gastos>;
  GastoForm:FormGroup;
  tipoForm:FormGroup;
  gasto:Gastos;
  user:Array<NuevoUsuario>;
  displayedColumns = ['No', 'tipo', 'valor','descripcion','eliminar'];
  valorGasto:number;
  cerrado:boolean;
  gastox:GastosX;
  complete:boolean;

  constructor(private __GastosService:GastosService,
    private toast:ToastrService,
    private usuario:AuthService,
    private token:TokenServiceService)
     { 
    this.GastoForm=this.crearForm();
    this.tipoForm=this.crearFormSecond();

    this.usuario.ListarUsuario().subscribe(data=>{
      let lista:any=data
      this.user=lista;
    });
    this.complete=true;
  }

  ngOnInit() {
  }

  inicializarPaginator() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.getTotalCost();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getTotalCost(){
    this.valorGasto=0;
    this.dataSource.filteredData.forEach(ele => {
      this.valorGasto=this.valorGasto+ele.valor;
    } );
  }

  crearForm(){
    return new FormGroup({
      tipo:new FormControl('',Validators.required),
      valor:new FormControl('',Validators.required),
      descrip:new FormControl('',Validators.required)
    });
  }

  crearFormSecond(){
    return new FormGroup({
      elegir:new FormControl('',Validators.required),
      usuario:new FormControl('',Validators.required),
      fecha:new FormControl(new Date(),Validators.required),
      fin:new FormControl(new Date(),Validators.required)

    });
  }

  IngresarGasto(){
    if(this.GastoForm.valid){
      this.gasto=new Gastos(this.GastoForm.value.tipo,
        this.GastoForm.value.valor,this.token.getUser(),
        this.GastoForm.value.descrip);
      this.__GastosService.Ingresar(this.gasto).subscribe(data=>{
        this.toast.success(data.mensaje,"Exito");
        this.GastoForm.reset();
      },error=>{
        if(error.error.mensaje!=undefined){
          this.toast.error(error.error.mensaje,"Error");
        }else{
          this.toast.error("Error en la consulta","Error");
        }
      }
      );
    }
  }

  ListarGastos(){
    if (this.tipoForm.valid){
      this.complete=false;
      this.cerrado=false;
      this.gastox=new GastosX(
        this.tipoForm.value.usuario,
        this.tipoForm.value.elegir,
        this.tipoForm.value.fecha,
        this.tipoForm.value.fin
      );
      if(this.tipoForm.value.elegir!=='todo' && this.tipoForm.value.usuario!=='todo'){
        this.__GastosService.listarTipoUserFecha(this.gastox).subscribe(data=>{
          let datos:any=data;
          this.dataSource=new MatTableDataSource(datos);
          this.inicializarPaginator();
          this.getTotalCost();
          this.complete=true;
          this.cerrado=undefined;
        });
      }else if(this.tipoForm.value.elegir==='todo' && this.tipoForm.value.usuario!=='todo'){
        this.__GastosService.listarUserFecha(this.gastox).subscribe(data=>{
          let datos:any=data;
          this.dataSource=new MatTableDataSource(datos);
          this.inicializarPaginator();
          this.getTotalCost();
          this.complete=true;
          this.cerrado=undefined;
        });
      }else if(this.tipoForm.value.elegir==='todo' && this.tipoForm.value.usuario==='todo'){
        this.__GastosService.listarFecha(this.gastox).subscribe(data=>{
          let datos:any=data;
          this.dataSource=new MatTableDataSource(datos);
          this.inicializarPaginator();
          this.getTotalCost();
          this.complete=true;
          this.cerrado=undefined;
        });
      }
     }
  }
  

  Eliminar(i){
    let id=this.dataSource.data[i].id;
    this.dataSource.data.splice(i,1);
    this.__GastosService.Eliminar(id).subscribe(data=>{
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

}
