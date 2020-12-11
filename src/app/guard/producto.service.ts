import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenServiceService } from '../service/token-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService implements CanActivate {

  realRol: string;

  constructor(
    private token:TokenServiceService,
    private route:Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{

    const expectedRol=route.data.expectedRol;
    const  roles= this.token.getAuth();
    this.realRol='user';

    roles.forEach(rol => {
         if(rol === 'ROLE_ADMIN'){
          this.realRol='admin';
         }
    });
    if(!this.token.getToken() || expectedRol.indexOf(this.realRol) === -1){
      this.route.navigate(['/inicio']);
      return false;
    }
    return true;
  }
}
