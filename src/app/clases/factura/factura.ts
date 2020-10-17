import { Producto } from '../productos/producto';

export class Factura{

    id:number;
    numeroFact:number;
    usuarioId:string;
    registroDate:Date;    
    productoId:Producto;
    cantidad:number;
    extras:string;

    constructor(
        numeroFact:number,
        registroDate:Date,
        usuarioId:string,
        producto:Producto,
        cantidad:number,
        extras:string){
            this.numeroFact=numeroFact;
            this.registroDate=registroDate;
            this.usuarioId=usuarioId;
            this.productoId=producto;
            this.cantidad=cantidad;
            this.extras=extras;

    }
}