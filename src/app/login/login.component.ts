import { Component, OnInit } from '@angular/core';
import {FormControl,FormGroup, Validators} from '@angular/forms';
import { Router } from "@angular/router";
import { LocalStorage } from "../clases/local-storage";
import { ToastrService } from "ngx-toastr";
import { TokenServiceService } from "../service/token-service.service";
import { AuthService } from "../service/auth.service";
import { LoginUsuario } from '../clases/loginUsuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  UserForm: FormGroup;
  Validar: boolean;
  local=new LocalStorage();
  hide = true;
  roles:string[]=[];
  loginusu:LoginUsuario;
  completar:boolean;
  constructor(private route:Router,private mensaje:ToastrService, 
    private token:TokenServiceService,private Servicio_login:AuthService) 
    {
   this.UserForm=this.crearFormulario();
   this.completar=true;
   }

   crearFormulario(){
     return new FormGroup({
      usuario: new FormControl('',Validators.required),
      contrasena: new FormControl('',Validators.required)
     });
   }

  ngOnInit() {
    if(this.token.getToken()){
      this.roles=this.token.getAuth();
    }
    
  }

  LogIn(){
    if(this.UserForm.valid){
      this.completar=false;
    this.loginusu=new LoginUsuario(this.UserForm.value.usuario,this.UserForm.value.contrasena);
    this.Servicio_login.LogIn(this.loginusu).subscribe(
      data =>{
        this.Validar=false;
        this.token.setToken(data.token);
        this.token.setUser(data.nombreUsuario);
        this.token.setAuth(data.authorities);
        this.roles=data.authorities;
        document.getElementById('boton').style.display='block';
        document.getElementById('botonCarro').style.display='block';
        this.mensaje.success("sesión iniciada","información");
        this.completar=true;
        this.route.navigate(["/inicio",{}])
    },
    err =>{
      this.Validar=true;
      this.completar=true;
      this.mensaje.error("error en la sesion",err.error.message);
    }
    );
     
    }
  }



}
