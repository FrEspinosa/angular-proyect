import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Notebook } from './notebook';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http'; //conectar con el Backend
import { map, catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import{ GlobalConstants } from '../common/globalConstant';

@Injectable({
  providedIn: 'root',
})
export class NotebookService {

  constructor(private http: HttpClient, private router: Router) {}

  getAllNotebooks(): Observable<Notebook[]> {
    return this.http
      .get(GlobalConstants.backendURL + '/GestionNotebooks')
      .pipe(map((response) => response as Notebook[]));
  }
  
  getNotebooksByEmpleadoIsNull(): Observable<Notebook[]> {
    return this.http
      .get(GlobalConstants.backendURL + '/GestionNotebooks/disponibles')
      .pipe(map((response) => response as Notebook[]));
  }

  crearNotebook(notebook: Notebook): Observable<Notebook> {
    console.log('Create notebook service');
    return this.http
      .post<Notebook>(GlobalConstants.backendURL + '/GestionNotebooks/alta', notebook)
      .pipe(
        map((response: any) => response.notebook as Notebook), //el map y pipe toman el json y lo convienten a un atributo Notebook
        catchError((e) => {
          if (e.status == 400 && e.error.mensaje) {
            return throwError(() => e);
          }
          return throwError(() => e);
        })
      );
  }
  
  getNotebook(id): Observable<Notebook> {
    return this.http.get<Notebook>(`${GlobalConstants.backendURL}/GestionNotebooks/${id}`).pipe(
      catchError((e) => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/notebooks']);
          console.error(e.error.mensaje);
        }
        return throwError(() => e);
      })
    );
  }

  updateNotebook(notebook: Notebook): Observable<Notebook> {
    //creo que el boservable es para que se quede escuchando y no refresque la pagina
    console.log('updatenotebook service');
    return this.http
      .put<Notebook>(`${GlobalConstants.backendURL}/GestionNotebooks/modificar/${notebook.id}`, notebook)
      .pipe(
        catchError((e) => {
          console.log(e)
          if (e.status == 400) {
            return throwError(() => e);
          }
          return throwError(() => e);
        })
      );
  }

  deleteNotebook(id: number): Observable<Notebook> {
    return this.http.delete<Notebook>(`${GlobalConstants.backendURL}/GestionNotebooks/eliminar/${id}`)
      .pipe(
        catchError((e) => {
          console.log(e)

          return throwError(() => e);
        })
      );
  }

 

  //Servicio invocado desde el FormEmpleado para asignarle una notebook
  asignarNotebookDisponible(notebook: Notebook, empleadoId: number): Observable<Notebook> {
    //creo que el boservable es para que se quede escuchando y no refresque la pagina
    console.log('ASIGNO NOTEBOOK? ');
    console.log(notebook)
    console.log(empleadoId)
    return this.http
      .post<Notebook>(`${GlobalConstants.backendURL}/GestionNotebooks/asignar/${empleadoId}`, notebook)
      .pipe(
        map((response: any) => response.notebook as Notebook),
       
        catchError((e) => {
          if (e.status == 400) {
            console.log('ERROR')

            return throwError(() => e);
          }
          console.log('ERROR')

          return throwError(() => e);
        })
      );
  }


  
  //Servicio invocado desde el FormEmpleado para asignarle una notebook
  eliminarNotebookEmpleado(notebook: Notebook, empleadoId: number): Observable<Notebook> {
    //creo que el boservable es para que se quede escuchando y no refresque la pagina
    console.log('ELIMINO LA ASIGNACION DE NOTEBOOK? ');
    console.log(notebook)
    console.log(empleadoId)
    return this.http
      .post<Notebook>(`${GlobalConstants.backendURL}/GestionNotebooks/desasignar/${empleadoId}`, notebook)
      .pipe(
        map((response: any) => response.notebook as Notebook),
       
        catchError((e) => {
          if (e.status == 400) {
            console.log('ERROR')

            return throwError(() => e);
          }
          console.log('ERROR')

          return throwError(() => e);
        })
      );
  }
}
