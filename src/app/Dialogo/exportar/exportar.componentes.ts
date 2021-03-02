import { Component, OnInit,Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EntreFecha } from 'src/app/clases/factura/EntreFecha';
import { VentasDay } from 'src/app/clases/factura/VentasDay';
import { ExcelExportService } from 'src/app/service/excel-export.service';
import { PagarService } from 'src/app/service/pagar.service';


@Component({
  selector: 'app-exportar',
  templateUrl: './exportar.component.html'
})
export class ExportarComponent implements OnInit {
  Filename:string='';
  datosAnteriores:VentasDay[];
  fecha:EntreFecha
  estado:boolean=false
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    private excelexport:ExcelExportService,
    private toast:ToastrService,
    private __servicioVentas:PagarService) {
      this.datosAnteriores=data.datos
     this.fecha= new EntreFecha("",data.fechaInicio,data.fechaFinal,"")
     }

  ngOnInit() {
  }

  Exportar():void{
    if(this.Filename!==''){
      this.excelexport.exportToExcel(this.datosAnteriores,this.Filename);
      this.toast.success("Exportación completa","Exitoso");
    }else{
      this.toast.error("Falta nombre","Error");
    }
  }

  CambioFecha(event):void{
    if(event.checked){
      this.estado=true
      this.__servicioVentas.TotalFechasComp(this.fecha).subscribe((data:VentasDay[])=> {
        this.datosAnteriores=data
        this.estado=false
      })
    }
  }
}
