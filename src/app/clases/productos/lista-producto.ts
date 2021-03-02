export class ListaProducto {
    id:number;
    nombre:string;
    tipo:string;
    cantidad:number;
    cantidadExiste:number;
    precio:number
    presa:number
    extra:string;
    
    constructor(id:number,producto:string,tipo:string,cantidadexiste:number,precio:number,p:number
        ,extra:string){
        this.id=id;
        this.nombre=producto;
        this.tipo=tipo;
        this.cantidad=1
        this.cantidadExiste=cantidadexiste;
        this.precio=precio;
        this.presa=p;
        this.extra=extra;
    }

}
