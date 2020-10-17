export class Producto{

    id:number;
    nombre:string;
    tipo:string;
    precio:number
    presa:number
    
    constructor(id:number,producto:string,tipo:string,precio:number,p:number){
        this.id=id;
        this.nombre=producto;
        this.tipo=tipo;
        this.precio=precio;
        this.presa=p;
    }
}