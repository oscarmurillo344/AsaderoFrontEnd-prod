import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NuevoUsuario } from '../clases/usuarios/nuevoUsuario';
import { UsuariosService } from '../service/usuarios.service';
import {MatDialog} from '@angular/material/dialog';
import { DialogoYesNoComponent } from '../Dialogo/dialogo-yes-no/dialogo-yes-no.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';



@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html'
})
export class UsuarioComponent implements OnInit,OnDestroy {

  UsuarioForm:FormGroup;
  ListaUsuario:Array<NuevoUsuario>;
  displayedColumns=['nombre','usuario','roles','Eliminar'];
  User:NuevoUsuario;
  hide:boolean=true;
  private unsuscribir = new Subject<void>();

  constructor(private __serviceUser:UsuariosService,
              private toast:ToastrService,
              public dialog: MatDialog) { 
    this.UsuarioForm=this.crearForm();
    this.ListaUsuario=new Array();
    this.listarUser();
  }

  ngOnInit() {
    this.listarUser();
  }
  ngOnDestroy(): void {
    this.unsuscribir.next();
    this.unsuscribir.complete();
  }

  crearForm(){
    return new FormGroup({
      nombre: new FormControl('',Validators.required),
      usuario: new FormControl('',Validators.required),
      email: new FormControl('',[Validators.email,Validators.required]),
      pass: new FormControl('',[Validators.required]),
      tipo:new FormControl('',Validators.required)
    });
  }

  listarUser(){
    this.__serviceUser.ListaUser().
    pipe(takeUntil(this.unsuscribir)).
    subscribe(data=>{
      let datas:any=data;
      if(datas!==undefined){
        this.ListaUsuario=datas;
      }
    });
  }

  CrearUser(){
    if(this.UsuarioForm.valid){
      if(this.UsuarioForm.value.tipo==='user'){
        this.User=new NuevoUsuario(
          this.minuscula(this.UsuarioForm.value.nombre),
          this.minuscula(this.UsuarioForm.value.usuario),
          this.minuscula(this.UsuarioForm.value.email),
          this.UsuarioForm.value.pass,
          ['user']
        );
      }else{
        this.User=new NuevoUsuario(
          this.minuscula(this.UsuarioForm.value.nombre),
          this.minuscula(this.UsuarioForm.value.usuario),
          this.minuscula(this.UsuarioForm.value.email),
          this.UsuarioForm.value.pass,
          ['user',this.UsuarioForm.value.tipo]
        );
      }
      this.__serviceUser.nuevoUser(this.User).
      pipe(takeUntil(this.unsuscribir))
      .subscribe(data=>{
        let da:any=data;
        if(da.mensaje!==undefined){
          this.toast.success(data.mensaje,"Exitoso");
        }else{
          this.toast.success("consulta realizada","Exitoso");
          console.log(da)
        }
        this.listarUser();
        this.UsuarioForm.reset();
      },error=>{
        if(error.error.mensaje!==undefined){
          this.toast.error(error.error.mensaje,"Error");
        }else{
          this.toast.error("Error en la consulta","Error");
          console.log(error)
        }
      });
    }
  }
  public minuscula(texto:string):string{
    return texto.toLocaleLowerCase();
   }

  Eliminar(i){

    let resultado=this.dialog.open(DialogoYesNoComponent,
      {data:{nombre:this.ListaUsuario[i].nombre,titulo:'usuario'}});
        resultado.afterClosed().subscribe(data=>{
          if(data==='true'){
            this.__serviceUser.EliminarUser(this.ListaUsuario[i].id).
            pipe(takeUntil(this.unsuscribir)).
            subscribe(data=>{
              this.toast.success(data.mensaje,"Exitoso");
              this.listarUser();
            },error=>{
                if(error.error.mensaje=== undefined){
                  this.toast.error("Error en consulta","Error");
                }else{
                  this.toast.error(data.mensaje,"Error");
                }
            });
          }else{
            resultado.close();
          }
        });
  }

}
