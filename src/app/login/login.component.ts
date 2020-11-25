import { Component, OnDestroy, OnInit } from '@angular/core';
import {FormControl,FormGroup, Validators} from '@angular/forms';
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TokenServiceService } from "../service/token-service.service";
import { AuthService } from "../service/auth.service";
import { LoginUsuario } from '../clases/usuarios/loginUsuario';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {


  UserForm: FormGroup;
  Validar: boolean;
  hide = true;
  roles:string[]=[];
  loginusu:LoginUsuario;
  completar:boolean;
  private unsuscribir = new Subject<void>();
  
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
   ngOnDestroy(): void {
    this.unsuscribir.next();
    this.unsuscribir.complete();
  }
  ngOnInit() {
    if(this.token.getToken()){
      this.roles=this.token.getAuth();
    }
    
  }

  LogIn(){
    if(this.UserForm.valid){
      this.completar=false;
    this.loginusu=new LoginUsuario(this.minuscula(this.UserForm.value.usuario),this.UserForm.value.contrasena);
    this.Servicio_login.LogIn(this.loginusu)
    .pipe(takeUntil(this.unsuscribir))
    .subscribe(
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

  public minuscula(texto:string):string{
   return texto.toLocaleLowerCase();
  }



}
