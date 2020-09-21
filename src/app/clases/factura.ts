import { Producto } from './producto';

export class Factura{

    id:number;
    numeroFact:number;
    usuarioId:string;
    registroDate:Date;    
    productoId:Producto;
    cantidad:number;

    constructor(
        numeroFact:number,
        registroDate:Date,
        usuarioId:string,
        producto:Producto,
        cantidad:number){
            this.numeroFact=numeroFact;
            this.registroDate=registroDate;
            this.usuarioId=usuarioId;
            this.productoId=producto;
            this.cantidad=cantidad;

    }
}