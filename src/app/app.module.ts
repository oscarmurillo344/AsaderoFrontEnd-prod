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

import { TokenServiceService } from "./service/token-service.service";
import { AuthService } from "./service/auth.service";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './interceptor/interceptor.service';
import { ProductoListService } from "./service/producto-list.service";
import {  ProductoService} from "./guard/producto.service";
import { InventarioComponent } from './inventario/inventario.component';
import { DialogoYesNoComponent } from './Dialogo/dialogo-yes-no/dialogo-yes-no.component';
import { DialogoUpdateComponent } from './Dialogo/dialogo-update/dialogo-update.component';
import { GastosComponent } from './gastos/gastos.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { UpdatePolloComponent } from './update-pollo/update-pollo.component';
import { LastSoldComponent } from './last-sold/last-sold.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { FilterArray } from './Pipe/filterArray';
import { ExcelExportService } from './service/excel-export.service';
import { ExportarComponent } from './Dialogo/exportar/exportar.componentes';
import { TablegastosComponent } from './control-ventas/tablegastos/tablegastos.component';

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    LoginComponent,
    SystemMainComponent,
    SystemCarComponent,
    ControlVentasComponent,
    InventarioComponent,
    DialogoYesNoComponent,
    DialogoUpdateComponent,
    ExportarComponent,
    FilterArray,
    GastosComponent,
    UpdatePolloComponent,
    LastSoldComponent,
    UsuarioComponent,
    TablegastosComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut:2000,
      positionClass:'toast-top-center',
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
            AuthService,
            ExcelExportService
          ],
  bootstrap: [AppComponent]
})
export class AppModule { }
