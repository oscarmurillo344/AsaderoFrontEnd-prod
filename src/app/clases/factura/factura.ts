import { Producto } from '../productos/producto';

export class Factura{

    id:number;
    numeroFact:number;
    usuarioId:string;
    RegistroDate:Date; 
    RegistroTime:Date;   
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
            this.RegistroDate=datenow;
            this.usuarioId=usuarioId;
            this.productoId=producto;
            this.cantidad=cantidad;
            this.extras=extras;

    }
}