import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Gastos } from '../clases/gasto/gastos';
import { AuthService } from '../service/auth.service';
import { GastosService } from '../service/gastos.service';
import { NuevoUsuario } from '../clases/usuarios/nuevoUsuario';
import { TokenServiceService } from '../service/token-service.service';
import { GastosX } from '../clases/gasto/gastosX';

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.css']
})
export class GastosComponent implements OnInit {

  GastoForm:FormGroup;
  gasto:Gastos;
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
    this.complete=true;
  }

  ngOnInit() {
  }

  
  crearForm(){
    return new FormGroup({
      tipo:new FormControl('',Validators.required),
      valor:new FormControl('',Validators.required),
      descrip:new FormControl('',Validators.required)
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

}
