import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from "../app/login/login.component";
import { SystemMainComponent } from "./system-main/system-main.component";
import { SystemCarComponent } from "./system-car/system-car.component";
import { ControlVentasComponent } from "./control-ventas/control-ventas.component";
import { ProductoService } from "./guard/producto.service";
import { InventarioComponent } from './inventario/inventario.component';
import { GastosComponent } from './gastos/gastos.component';
import { UpdatePolloComponent } from './update-pollo/update-pollo.component';

const routes: Routes = 
[
  {path:'login', component: LoginComponent},
 {path:'inicio',component: SystemMainComponent, 
  canActivate: [ProductoService],data:{ expectedRol:['admin','user']}},
  {path:'updatep',component:UpdatePolloComponent, 
  canActivate: [ProductoService],data:{ expectedRol:['admin']}},
  {path:'carrito',component: SystemCarComponent, 
  canActivate: [ProductoService],data:{ expectedRol:['admin','user']}},
  {path:'inventario',component: InventarioComponent, 
  canActivate: [ProductoService],data:{ expectedRol:['admin']}},
  {path:'gastos',component: GastosComponent, 
  canActivate: [ProductoService],data:{ expectedRol:['admin','user']}},
  {path:'ControlSold',component: ControlVentasComponent, 
  canActivate: [ProductoService],data:{ expectedRol:['admin']}},
  {path:'', redirectTo:'/login', pathMatch:'full'},
  {path:'**', component:SystemMainComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
