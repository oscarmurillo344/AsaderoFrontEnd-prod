import { Injectable } from '@angular/core';
import * as Filesaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE=
'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF=8';
const EXCEL_EXXT='.xlsx'

@Injectable()
export class ExcelExportService {

  constructor() { }

   public exportToExcel(json:any[],excelFileName:string):void{
      const worksheet:XLSX.WorkSheet=XLSX.utils.json_to_sheet(json);
      const workbook:XLSX.WorkBook={
        Sheets:{'data':worksheet},
        SheetNames:['data']
      };
      const excelBuffer:any=XLSX.write(workbook,{bookType:'xlsx',type:'array'});
      this.saveAsExcel(excelBuffer,excelFileName);
        }

  private saveAsExcel(buffer:any,fileName:string):void{

    const data:Blob=new Blob([buffer],{ type:EXCEL_TYPE });
    Filesaver.saveAs(data,fileName+'_export_'+new Date()+EXCEL_EXXT);
  }
}
