import { Component, OnInit,Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ExcelExportService } from 'src/app/service/excel-export.service';


@Component({
  selector: 'app-exportar',
  templateUrl: './exportar.component.html'
})
export class ExportarComponent implements OnInit {
  Filename:string='';
  datos:any[];
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any[],
    private excelexport:ExcelExportService,
    private toast:ToastrService) {
      this.datos=data;
     }

  ngOnInit() {
  }

  Exportar():void{
    if(this.Filename!==''){
      this.excelexport.exportToExcel(this.datos,this.Filename);
      this.toast.success("Exportación completa","Exitoso");
    }else{
      this.toast.error("Falta nombre","Error");
    }
  }

}
