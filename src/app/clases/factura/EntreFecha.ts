export class EntreFecha{

     usuario:string;
     fechaFirst:Date;
     fechaSecond:Date;

     constructor(usuario:string,
        FechaFirst:Date,
        FechaSecond:Date){
        
        this.usuario=usuario;
        this.fechaFirst=FechaFirst;
        this.fechaSecond=FechaSecond;
     }
}