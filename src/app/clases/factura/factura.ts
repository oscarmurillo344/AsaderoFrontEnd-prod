import { Producto } from '../productos/producto';

export class Factura{

    id:number;
    numeroFact:number;
    usuarioId:string;
    datenow:Date; 
    tiempoactual:Date;   
    productoId:Producto;
    cantidad:number;
    extras:string;

    constructor(
        numeroFact:number,
        datenow:Date,
        usuarioId:string,
        producto:Producto,
        cantidad:number,
        extras:string){
            this.numeroFact=numeroFact;
            this.datenow=datenow;
            this.usuarioId=usuarioId;
            this.productoId=producto;
            this.cantidad=cantidad;
            this.extras=extras;

    }
}