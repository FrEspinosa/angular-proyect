import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from './usuario'

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private _usuario:Usuario;
  private _token: string;

  constructor(private http: HttpClient) { }

  public get usuario(): Usuario{
    if(this._usuario != null){
      return this._usuario;
    }
    else if( this._usuario == null && sessionStorage.getItem('usuario') != null){
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario // lo casteo a Usuario
    }
    return new Usuario();
  }

  public get token(): string{
    if(this._token != null){
      return this._token;
    }
    else if( this._token == null && sessionStorage.getItem('token') != null){
      this._token = sessionStorage.getItem('token'); // lo casteo a Usuario
    }
    return null;
  }

  login(usuario:Usuario):Observable<any>{

    const urlEndpoint = 'http://localhost:8080/oauth/token';
    const credenciales = btoa('angularApp' + ':' + '12345'); //btoa transforma a base 64
    const httpHeaders = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded','Authorization': 'Basic ' + credenciales});

    let params = new URLSearchParams();
    params.set('grant_type','password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);
    console.log("Parametros enviados = " + params.toString());
    return this.http.post<any>(urlEndpoint, params.toString(), {headers: httpHeaders});
  }

  guardarUsuario(accessToken: String):void {
    let payload = this.obtenerDatosToken(accessToken);

    console.log("ACABO DE GUARDAR EL USURIO: ");
    console.log(payload);

    this._usuario = new Usuario();
    this._usuario.nombre = payload.nombre
    this._usuario.apellido = payload.apellido
    this._usuario.email = payload.email
    this._usuario.username = payload.user_name
    this._usuario.roles = payload.authorities
    sessionStorage.setItem('usuario',JSON.stringify(this._usuario));//convierte el usuario a tipo Json(texto)
  }

  guardarToken(accessToken: string):void {
    this._token = accessToken;
    sessionStorage.setItem('token',  accessToken);
  }

  obtenerDatosToken(accessToken:String):any{
    if(accessToken != null){
      return  JSON.parse(atob(accessToken.split(".")[1]));//obtengo el payload del jwt.io, para obtener solo los datos personales
    }
    return null;
  }

  isAuthenticated(): boolean{
    let payload = this.obtenerDatosToken(this.token);
    if(payload != null && payload.user_name){
      return true;
    }
    return false;
  }

  hasRole(role:string): boolean{
    if(this.usuario.roles.includes(role)){
      return true;
    }
    return false;
  }

  logout():void{
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
    //sessionStorage.removeItem('token')
  //  sessionStorage.removeItem('usuario')
  }


}
