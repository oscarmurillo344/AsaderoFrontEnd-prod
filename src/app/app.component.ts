import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SistemaVentasApp';

 public static OrdenarData(dato:Array<any>):void{
    dato.sort(function (o1,o2) {
      if (o1.productoId.nombre > o2.productoId.nombre) { //comparación lexicogŕafica
        return 1;
      } else if (o1.productoId.nombre < o2.productoId.nombre) {
        return -1;
      } 
      return 0;
    });
  }
}
