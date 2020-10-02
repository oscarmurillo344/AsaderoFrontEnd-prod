import { Component,OnInit,AfterContentChecked  } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { LocalStorage } from "../clases/local-storage";
import { Router } from "@angular/router";
import { DataService } from '../service/data.service';
import { updatePollo } from '../clases/updatePollo';


@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit  {

          valor :boolean;
          open :boolean;
          local :LocalStorage;
          notificacion:number;
          Lista:any;
          vista:boolean;
          update:updatePollo;
          
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,private router:Router,
    public __Data:DataService) {
    this.verificar();
    this.local=new LocalStorage();
  } 


     ngOnInit(){
     if(this.local.GetStorage("AuthToken")){
      this.valor=false;
      this.router.navigate(["/inicio"]);
    }else{
       this.valor=true;
     }
    
    }
    verificar(){
      setInterval(() => {
        this.notificacion=0;
       if(this.local.GetStorage('DataCarrito') != null){
         this.Lista=this.local.GetStorage('DataCarrito');
         for(var i=0;i<this.Lista.length && this.Lista!=null;i++){
           this.notificacion+=this.Lista[i].cantidad
         }
        }
      }, 1500);
    }

    logOut(){
      this.local.RemoveAll();
      this.router.navigate(['/login']);
      document.getElementById('boton').style.display='none';
      document.getElementById('botonCarro').style.display='none';
    }
    

}
