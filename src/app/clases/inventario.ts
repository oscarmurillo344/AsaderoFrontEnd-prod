import { Producto } from './producto';

export class Inventario {
    id:number;
    productoId:Producto;
    cantidad:number;
    cantidadExist:number;

    constructor(
        productoId:Producto,
        cantidad:number,
        cantidadExist:number){
            this.productoId=productoId;
            this.cantidad=cantidad;
            this.cantidadExist=cantidadExist;

    }

public getID():number {
    return this.id;
    }
}