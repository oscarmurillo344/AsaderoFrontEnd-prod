import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from "./material/material.module";
import { ToastrModule } from "ngx-toastr";
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { LoginComponent } from './login/login.component';
import { SystemMainComponent } from './system-main/system-main.component';
import { SystemCarComponent } from './system-car/system-car.component';
import { ControlVentasComponent } from './control-ventas/control-ventas.component';
import { ErrorComponent } from './error/error.component';
import { PedidosComponent } from './pedidos/pedidos.component';

import { TokenServiceService } from "./service/token-service.service";
import { AuthService } from "./service/auth.service";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './interceptor/interceptor.service';
import { ProductoListService } from "./service/producto-list.service";
import {  ProductoService} from "./guard/producto.service";
import { InventarioComponent } from './inventario/inventario.component';
import { FilterPipe } from './Pipe/filter';
import { DialogoYesNoComponent } from './Dialogo/dialogo-yes-no/dialogo-yes-no.component';
import { DialogoUpdateComponent } from './Dialogo/dialogo-update/dialogo-update.component';
import { FilterInventario } from './Pipe/filtroInventario';
import { GastosComponent } from './gastos/gastos.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    LoginComponent,
    SystemMainComponent,
    SystemCarComponent,
    ControlVentasComponent,
    ErrorComponent,
    PedidosComponent,
    InventarioComponent,
    FilterPipe,
    DialogoYesNoComponent,
    DialogoUpdateComponent,
    FilterInventario,
    GastosComponent
  ],
  entryComponents:[DialogoYesNoComponent,DialogoUpdateComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut:2500,
      positionClass:'toast-bottom-right',
      preventDuplicates:false
    }),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    HttpClientModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })

  ], 
providers: [
            {
             provide: HTTP_INTERCEPTORS,
            useClass: InterceptorService,
               multi: true
            },
            ProductoService,
            ProductoListService,
            TokenServiceService,
            AuthService
          ],
  bootstrap: [AppComponent]
})
export class AppModule { }
