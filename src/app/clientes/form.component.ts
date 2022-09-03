import { Component, Injectable, OnInit, ViewChild } from '@angular/core';

import { LoginService } from '../usuario/login.service'; //importo el service donde creo la lista de clientes.
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Notebook } from '../notebook/notebook';
import { NotebookService } from '../notebook/notebook.service';
import { ModalService } from '../notebook/modal/modal.service';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { fadeOut } from '../animations/template.animations';

import{ GlobalConstants } from '../common/globalConstant';

// REGISTRO FORMBUILDER -- ESTO SIRVE PARA VALIDAR LOS CAMPOS.
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  animations: [fadeOut]
})
@Injectable({
  // Al importar este Componente en notebooks.component.ts para vaciar la lista de notebooks disponibles, debo hacerlo Injectable.
  providedIn: 'root',
})
export class FormComponent implements OnInit {
  public columns = 4;

  public cliente: Cliente = new Cliente(); // este atributo lo enriquece el ngModel del html (Binding) es bidireccional.
  public errores: string[] = [];
  public fotoSeleccionada: File;
  public fotoSeleccionadaQueSeSube: File;
  public role: boolean;
  notebooksAsignadas: Notebook[];

  listaNotebook: Notebook[];
  @ViewChild(Notebook) notebookDisponibles: Notebook[];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<any>;

  dataSourceNotebooks: MatTableDataSource<Notebook>;
  DSNotebookDisp: MatTableDataSource<Notebook>;
  displayedColumns: String[] = ['id', 'fusapId', 'marca', 'modelo', 'actions'];
  notebookEmpleadoSeleccionada: Notebook;
  private subscription: Subscription;

  imageSrc = null;
  variableGlobal = GlobalConstants.backendURL;
  variableImagenesGuardadas = GlobalConstants.backendURL + "/uploadFromUsers/";

  altaEmpleadoForm: UntypedFormGroup;

  constructor(
    public modalService: ModalService,
    public clienteService: ClienteService,
    private notebookService: NotebookService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public loginService: LoginService,
    private sanitizer: DomSanitizer,
    breakpointObserver: BreakpointObserver,
    public sideNav: SideNavComponent,
    private formBuilder: UntypedFormBuilder, // Lo llamo en el costructor.
  ) {

    // Template para realizar la validación de los campos del alta de empleado
      this.altaEmpleadoForm = this.formBuilder.group({
      nombreValidado: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      apellidoValidado: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      emailValidado: ['', [Validators.required, Validators.email]],
      fechaIngresoValidado: ['', [Validators.required]]

    });
  }

  ngOnInit() {
    this.cargarCliente();
    this.role = this.loginService.hasRole('ROLE_USER');
  }


  public mostrarErrorRegistro(control: string): string {
    let retorno = '';

    switch (control) {

      case 'nombreValidado':
        if (this.altaEmpleadoForm.controls['nombreValidado'].hasError('required')) {
          retorno = 'Debe ingresar un nombre.';
        }
        if (this.altaEmpleadoForm.controls['nombreValidado'].hasError('minLength')) {
          retorno = 'Error con el minimo de caracteres';
        }
        if (this.altaEmpleadoForm.controls['nombreValidado'].hasError('maxLength')) {
          retorno = 'Maximo de caracteres permitidos: 20';
        }
      break;

      case 'apellidoValidado':

        if (this.altaEmpleadoForm.controls['apellidoValidado'].hasError('required')) {
          retorno = 'Debe ingresar un apellido.';
        }
        if (this.altaEmpleadoForm.controls['apellidoValidado'].hasError('minLength')) {
          retorno = 'Error con el minimo de caracteres';
        }
        if (this.altaEmpleadoForm.controls['apellidoValidado'].hasError('maxLength')) {
          retorno = 'Maximo de caracteres permitidos: 20';
        }
      break;

      case 'emailValidado':

        if (this.altaEmpleadoForm.controls['emailValidado'].hasError('required')) {
          retorno = 'Debe ingresar un email.';
        }
        if (this.altaEmpleadoForm.controls['emailValidado'].hasError('email')) {
          retorno = 'Error con el formato del email';
        }
      break;

      case 'fechaIngresoValidado':

        if (this.altaEmpleadoForm.controls['fechaIngresoValidado'].hasError('required')) {
          retorno = 'Debe ingresar una fecha de ingreso.';
        }
  
      break;
    }

    return retorno;
  }


  //cargo el cliente
  cargarCliente() {
    console.log(' FORM  notebooksSinAsignar');

    this.activatedRoute.params.subscribe((params) => {
      //vamos a suscribir un observador que este observando cuando obtengamos el ID.
      let id = params['id'];
      if (id) {
        this.clienteService.getCliente(id).subscribe((cliente) => {
          (this.cliente = cliente),
          //Cargo table de notebook asignadas al colaborador
          this.notebooksAsignadas = this.cliente.notebooks
          this.dataSourceNotebooks = new MatTableDataSource(this.notebooksAsignadas);
          this.dataSourceNotebooks.sort = this.sort;
          this.dataSourceNotebooks.paginator = this.paginator;

          console.log(cliente);
        });
      }
    });
  }


  public create(): void {
    this.clienteService.crearCliente(this.cliente).subscribe(
      (cliente) => {
        swal.fire('Nuevo colaborador', `Creado con éxito!`, 'success');
        this.router.navigate(['/clientes']); //al finalizar la creacion del cliente, redirige a la lsita clientes
      },
      (err) => {
        this.errores = err.error.errors as string[];
        console.log(err.error.errors);
        console.log('Codigo errordel backend => ' + err.status);
      }
    );
  }

  updateCliente(): void {
    this.clienteService.updateCliente(this.cliente).subscribe(
      (cliente) => {
        console.log("Despues de updatear el cliente, el cliente es esto: " + cliente);
        this.router.navigate(['/clientes']);
        swal.fire(
          'Colaborador actualizado',
          `El colaborador ${this.cliente.nombre} ha sido actualizado con éxito!`,
          'success'
        );
      },
      (err) => {
        this.errores = err.error.errors as string[];
        console.log(err.error.errors);
        console.log('Codigo errordel backend => ' + err.status);
      }
    );
  }


  /* LUCHO --> FUNCION PARA REFRESCAR ARCHIVO SUBIDO.
    readURL(event): void {
      if (event.target.files && event.target.files[0]) {
        let file = (event.target as HTMLInputElement).files[0];
  
          const reader = new FileReader();
          reader.onload = e => this.imageSrc = reader.result;
  
          reader.readAsDataURL(file);
      }
  }
  */
  seleccionarFoto(event) {

    // Selecciono la imagen y la guardo en la variable.
    this.fotoSeleccionada = event.target.files[0]; // es un array de archivoss, pero solo usamos el 1ero.
    
    // Esto de acá hace que se muestre la imagen seleccionada.
    const reader = new FileReader();
    reader.onload = e => this.imageSrc = reader.result;
    reader.readAsDataURL(this.fotoSeleccionada);
    console.log("Foto seleccionada: " + this.fotoSeleccionada);

    /*
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      // si es mayor a 0 es que no es image
      swal.fire(
        'Error al seleccionar:',
        'El archivo debe ser de tipo imagen',
        'error'
      );
      this.fotoSeleccionada = null;
    }
    */

  }

  // TODO - Esta funcion tiene una mejora a implementar del lado del backend, que la respuesta sea el cliente en si.
  
  subirFoto() {
    if (this.cliente.id == null) {
      swal.fire('Actualizar foto de perfil', `Primero debe crear un colaborador!`, 'warning');
    } 
    
    else {
      this.clienteService.subirFotoPefil(this.fotoSeleccionada, this.cliente.id).subscribe((cliente) => {
        //console.log("La respuesta de cliente: " + cliente);
        //console.log("La respuesta de values object: " + Object.values(cliente));
        //this.cliente.fotoPerfil = cliente.fotoPerfil; -- NO FUNCIONA, la respuesta no trae ningun cliente.
        // this.router.navigate(['/clientes/form/' + this.cliente.id]);
        this.imageSrc = null;
        this.router.navigate(['/clientes']);
        swal.fire('Actualizar foto de perfil', `La foto de ${this.cliente.apellido} ${this.cliente.nombre} se ha subido con éxito` , 'success');
         }
      );
    }
  }

  cancelarCarga(){
    console.log("No se realizaron cambios");
    this.imageSrc = null;
    swal.fire(
      'La carga de foto fue cancelada',
      `No se realizaron cambios`,
      'warning'
    )
  }


  //Filtro de notebooks

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceNotebooks.filter = filterValue;
  }


  // Consulto las notebook que hay disponibles para asignar a un empleado
  notebookDisponiblesModal() {
    //----
    //si el sideNav esta abierto, lo cierro por problemas de diseno no solucionados.
    if (this.sideNav.isShowing) {
      this.sideNav.toggleSidenav();
    }
    //----
    this.notebookService
      .getNotebooksByEmpleadoIsNull()
      .subscribe((notebooks) => {
        console.log(`notebooks obtenidas ${notebooks.length}`);
        console.log(notebooks);
        this.notebookDisponibles = notebooks;
        this.DSNotebookDisp = new MatTableDataSource(this.notebookDisponibles);

        this.modalService.abrirModal();
      });
  }

  asignarNotebookDisponible(NotebookSeleccionada: Notebook) {
    console.log(this.cliente.notebooks)

    swal.fire({
      title: '¿Está seguro?',
      text: `¿Seguro que desea asignar esta notebook?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, asignar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: false
    }).then((result) => {

      if (result.isConfirmed) {


        this.notebookService.asignarNotebookDisponible(NotebookSeleccionada, this.cliente.id).subscribe(
          Response => {
            this.cliente.notebooks.push(Response) // hacemos que en la lista de notebooks APAREZCA la notebook asignada  , Filtrando sobre la lista. 
            this.dataSourceNotebooks = new MatTableDataSource(this.cliente.notebooks);
            console.log(this.cliente.notebooks)
            console.log("this.cliente.notebooks")
            swal.fire(
              'ASIGNADA!',
              `Su notebook a sido asignada.`,
              'success'
            )
          })
      }
      {
        swal.fire(
          'Cancelado',
          'Cancelo la asignacion',
          'error'
        )
      }
    })
  }


  eliminarNotebookEmpleado(notebook: Notebook) {
    swal.fire({
      title: '¿Está seguro?',
      text: `¿Seguro que desea eliminar la notebook asignada del empleado?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: false
    }).
      then((result) => {
        if (result.isConfirmed) {

          this.notebookService.eliminarNotebookEmpleado(notebook, this.cliente.id).subscribe(
            Response => {
              console.log(this.notebooksAsignadas.length)
              this.notebooksAsignadas = this.notebooksAsignadas.filter(cli => cli !== notebook) // hacemos que de la lista de notebooks desaparezca el eliminado, Filtrando sobre la lista. se veran todos los que son distintos  al notebook eliminado
              console.log(this.notebooksAsignadas.length)
              this.deleteRow(notebook);

              swal.fire(
                'Eliminado!',
                `La relacion de notebook a sido eliminada.`,
                'success'
              )
            })
        }
        {
          swal.fire(
            'Cancelado',
            'Cancelo la asignacion',
            'error'
          )
        }
      })
  }

  deleteRow(row: any): void {
    const index = this.dataSourceNotebooks.data.indexOf(row, 0);
    console.log("index " + index)
    if (index > -1) {
      this.dataSourceNotebooks.data.splice(index, 1);
      this.dataSourceNotebooks.paginator = this.paginator;//vuelvo a paginar para que refreque el splice(

    }
    this.table.renderRows();
  }
}
