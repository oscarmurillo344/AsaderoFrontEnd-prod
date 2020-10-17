import { Producto } from './producto';

export class Inventario {
    id:number;
    productoId:Producto;
    extras:string;
    cantidad:number;
    cantidadExist:number;

    constructor(
        productoId:Producto,
        extras:string,
        cantidad:number,
        cantidadExist:number){
            this.productoId=productoId;
            this.extras=extras;
            this.cantidad=cantidad;
            this.cantidadExist=cantidadExist;

    }

public getID():number {
    return this.id;
    }
}