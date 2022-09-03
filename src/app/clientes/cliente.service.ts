import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Cliente } from './cliente'; //importo la clase(objeto) Cliente para poder crear instancias del tipo Cliente[]
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http'; //conectar con el Backend
import { map, catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import{ GlobalConstants } from '../common/globalConstant';

import { Router } from '@angular/router';

// Injectable es para clase de servicios, representan logica de negocio y se pueden injectar a otro componente,
//   \->se puede injectar via inj de dependencia a una clase Component
@Injectable({
  //  providedIN remplaza el agregarlo en el appModule. antes se importaba en el module y se agregaba en el "providers:[]". ahora ya no.
  providedIn: 'root',
})
export class ClienteService {
  public fotoPerfil: File;

  constructor(private http: HttpClient, private router: Router, private lalala: HttpClient) {}

  getAllClientes(): Observable<Cliente[]> {
    //return of(CLIENTES);
    return this.http.get(GlobalConstants.backendURL + '/empleados').pipe(map((response) => response as Cliente[]));
  }
 
  crearCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(GlobalConstants.backendURL + '/empleado/crear', cliente)
      .pipe(
        map((response: any) => response.cliente as Cliente), //el map y pipe toman el json y lo convienten a un atributo Cliente
        catchError((e) => {
          if (e.status == 400 && e.error.mensaje) {
            return throwError(() => e);
  
          }
          return throwError(() => e);
        })
      );
  }

  updateCliente(cliente: Cliente): Observable<Cliente> {
    //creo que el boservable es para que se quede escuchando y no refresque la pagina
    return this.http
      .put<Cliente>(`${GlobalConstants.backendURL}/empleado/${cliente.id}`, cliente)
      .pipe(
        catchError((e) => {
          if (e.status == 400) {
            return throwError(() => e);
          }
          return throwError(() => e);
        })
      );
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${GlobalConstants.backendURL}/empleado/${id}`).pipe(
      catchError((e) => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/clientes']);
          console.error(e.error.mensaje);
        }
        return throwError(() => e);
      })
    );
  }

  deleteCliente(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${GlobalConstants.backendURL}/empleado/${id}`).pipe(
      catchError((e) => {
        console.warn(e);
        console.log(e.error);
        return throwError(() => e);
      })
    );
  }

  subirFotoPefil(archivo: File, id): Observable<Cliente> {
    let formData = new FormData(); //utilizar el mismo formato para multipart/form-data , lo requerido para subir archivos
    formData.append('archivo', archivo);
    formData.append('id', id);

    // TODO - En caso de querer que esto funcione (que retorne un cliente), hay que modificar la respuesta del BACK. Ya que
    // solo esta retornando el nombre de la foto, y no el cliente en si.
    return this.http.post<Cliente>(`${GlobalConstants.backendURL}/empleado/cargarImagen`, formData).pipe(
        // Comentamos esta linea porque hace que la respuesta sea NULA.
        //map((response: any) => response.cliente as Cliente), //el map y pipe toman el json y lo convienten a un atributo Cliente
        catchError((e) => {
          console.error(e.error);
          //swal.fire(e.error.mensaje, e.error.error, 'error');
          swal.fire(e.error.message, e.error.error, 'error');
          return throwError(() => e);
        })
      );
  }
}
