export class LoginUsuario{
    nombreUsuario: string;
    password: string;

    constructor(usuario:string,pass:string){
        this.nombreUsuario=usuario;
        this.password=pass;
    }
}