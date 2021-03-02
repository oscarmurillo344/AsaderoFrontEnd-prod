export class EntreFecha{

     usuario?:string;
     fechaFirst:Date;
     fechaSecond:Date;
     dia?:string;

     constructor(usuario:string,
        FechaFirst:Date,
        FechaSecond:Date,
        dia:string){
        
        this.usuario=usuario;
        this.fechaFirst=FechaFirst;
        this.fechaSecond=FechaSecond;
        this.dia=dia;
     }
}