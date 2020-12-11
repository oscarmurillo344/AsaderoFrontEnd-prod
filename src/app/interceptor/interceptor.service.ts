import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent,HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenServiceService } from '../service/token-service.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private token:TokenServiceService,private route:Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let intreq = req;
   const token =this.token.getToken();

   if(token != null){
     intreq = req.clone({
      setHeaders:{
        'Authorization':"Bearer "+token,
        "Content-Type": "application/json"
      }
     });
   }
   return next.handle(intreq);
  }
}
