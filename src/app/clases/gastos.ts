export class Gastos {

    id:number;
    fehca:Date;
    usuario:string;
    tipo:string;
    valor:number;
    descripcion:string;

    constructor(tipo:string,
        valor:number,
        usu:string,
        descripcion:string){
            this.tipo=tipo;
            this.valor=valor;
            this.usuario=usu;
            this.descripcion=descripcion;

    }
}
