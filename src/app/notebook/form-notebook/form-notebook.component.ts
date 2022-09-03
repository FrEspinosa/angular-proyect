import { Component, OnInit } from '@angular/core';
import { Notebook } from '../notebook'
import { NotebookService } from '../notebook.service'
import { Router, ActivatedRoute} from '@angular/router'
import swal from 'sweetalert2';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { LoginService } from '../../usuario/login.service'
import { ClienteService } from '../../clientes/cliente.service'
import { Cliente } from '../../clientes/cliente'

@Component({
  selector: 'app-form-notebook',
  templateUrl: './form-notebook.component.html',
  styleUrls: ['./form-notebook.component.css']
})
export class FormNotebookComponent implements OnInit {
  public notebook: Notebook = new Notebook; // este atributo lo enriquece el ngModel del html (Binding) es bidireccional.
  public empleado : Cliente = new Cliente;
  public titulo: string = "Crear Notebook"
  public errores: string[] = [];
  public role:boolean;


  public colSize=5;
  public isMobile: boolean = false;


  constructor(private clienteService: ClienteService,private loginService: LoginService, private notebookService: NotebookService, private router: Router ,
              private activatedRoute: ActivatedRoute,breakpointObserver: BreakpointObserver) {

              }


  ngOnInit() {
    this.cargarNotebook();
    this.role = this.loginService.hasRole('ROLE_USER');
  }

  cargarNotebook(): void {
    console.log("cargar Notebook")
    this.activatedRoute.params.
    subscribe(params =>{
      let id = params['id']
      console.log( [id])
      if(id){
        this.notebookService.getNotebook(id).subscribe( (notebook) => { this.notebook = notebook, 
          console.log(this.empleado.email)
          
          if(notebook.empleado != null){
            this.empleado = notebook.empleado
            console.log("HAY EMPLEADO. " + this.empleado.nombre)
            this.activatedRoute.params.
            subscribe(params =>{  //vamos a suscribir un observador que este observando cuando obtengamos el ID
                this.clienteService.getCliente(this.notebook.empleado.id).subscribe( (cliente) => { this.empleado = cliente,console.log(cliente)})
                console.log('busco empleado   ID ',+ this.notebook.id)
                console.log(this.empleado)
            })
          }
          console.log("NO HAY EMPLEADO ")

        })
      }
     
    }
    )
    
  }


    public create(): void {
      console.log('createNotebook  COMP')

      this.notebookService.crearNotebook(this.notebook).subscribe(notebook => {
        console.log(notebook)
        swal.fire(  'Nueva Notebook',  `La notebook ha sido creada con éxito!`,  'success');
        this.router.navigate(['/notebooks']) //al finalizar la creacion del notebook, redirige a la lsita notebooks
      },
      err =>{
        this.errores = err.error.errors as string[];
        console.log(err.error.errors)
        console.log("Codigo error del backend => " + err.status)
      }
      )
    }

    updateNotebook():void {
      console.log('updatenotebook component')
      console.log(this.notebook)
      this.notebookService.updateNotebook(this.notebook)
        .subscribe( notebook => {
          this.router.navigate(['/notebooks'])

          swal.fire('Notebook Actualizada', `Notebook ${this.notebook.fusapId}- ${this.notebook.marca} actualizado con éxito!`, 'success')
        },
        err =>{
          this.errores = err.error.errors as string[];
          console.log(err.error.errors)
          console.log("Codigo errordel backend => " + err.status)
        })
    }


}
