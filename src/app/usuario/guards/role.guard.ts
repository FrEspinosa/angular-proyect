import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../login.service'
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router){

  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      let role:string[] = route.data['role'] as string[];
        let hasRole = false;
           role.forEach(role => {
               if (this.loginService.hasRole(role)) {
                  hasRole =  true;
               }
           });
           if(hasRole){return true}
      else{
      swal.fire('Acceso denagado!', `${this.loginService.usuario.username} no tienes acceso a este recurso.`, 'warning')
      this.router.navigate(['/clientes'])//si falla el login , lo devuelvo al login
    return false;
    }
  }

}
