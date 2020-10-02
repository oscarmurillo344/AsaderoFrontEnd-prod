export class ListaProducto {
    id:number;
    nombre:string;
    tipo:string;
    cantidad:number;
    cantidadExiste:number;
    precio:number
    presa:number
    extra:string;
    
    constructor(id:number,producto:string,tipo:string,cantidad:number,cantidadexiste:number,precio:number,p:number
        ,extra:string){
        this.id=id;
        this.nombre=producto;
        this.tipo=tipo;
        this.cantidad=cantidad;
        this.cantidadExiste=cantidadexiste;
        this.precio=precio;
        this.presa=p;
        this.extra=extra;
    }

    public setProducto(product:string){
        this.nombre=product;
    }
    public getProducto():string{
        return this.nombre;
    }

    public setTipo(tipo:string){
        this.tipo=tipo;
    }
    public getTipo():string{
        return this.tipo;
    }

    public setCantidad(cantidad:number){
        this.cantidad=cantidad;
    }
    public getCantidad():number{
        return this.cantidad;
    }

    public setPrecio(pre:number){
        this.precio=pre;
    }
    public getPrecio():number{
        return this.precio;
    }
    


}
