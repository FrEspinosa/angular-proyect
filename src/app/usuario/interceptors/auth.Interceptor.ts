import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { LoginService } from '../login.service'
import swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import { Observable,throwError } from 'rxjs';
import { Router } from '@angular/router';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {


  constructor(private loginService: LoginService, private router: Router){ }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
      catchError(e =>{
        if(e.status==401){

          if(this.loginService.isAuthenticated()){
            this.loginService.logout();
          }
          this.router.navigate(['/login'])//si falla el login , lo devuelvo al login
        }

        if(e.status==403){
            swal.fire('Acceso denagado!', `${this.loginService.usuario.username} no tienes acceso a este recurso.`, 'warning')
            this.router.navigate(['/clientes'])//si falla el login , lo devuelvo al login
          }
          return throwError(e);
      })

    return next.handle(req).pipe(

    );
  }
}
