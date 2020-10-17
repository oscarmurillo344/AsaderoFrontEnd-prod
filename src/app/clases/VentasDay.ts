export class VentasDay{

     usuario:string;
     nombre:string;
     precio:number;
     cantidad:number;
     fecha:string;
     hora:string;
     
     constructor(usuario:string,
        producto:string,
        precio:number,
        cantidad:number){
            
    this.usuario=usuario;
    this.nombre=producto;
    this.precio=precio;
    this.cantidad=cantidad;
     }
}