import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../login.service'
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if(this.loginService.isAuthenticated()){
        if(this.isTokenExpirado()){
          this.loginService.logout();
          this.router.navigate(['/login']);
        return false; 
        }
        return true;
      }
      this.router.navigate(['/login']);
    return false;
  }

  isTokenExpirado(): boolean {
    let token = this.loginService.token;
    let payload = this.loginService.obtenerDatosToken(token);

    let now = new Date().getTime() / 1000; // fecha actual en segundos.
    if( payload.exp < now ){
      return true;
    }
    return false
  }

}
