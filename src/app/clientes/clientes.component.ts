import { Component, OnInit , ViewChild } from '@angular/core';
import { Cliente } from './cliente'  //importo la Clase(Objeto) Cliente para crear instancias.
import { ClienteService } from './cliente.service' //importo el service donde creo la lista de clientes.
import swal from 'sweetalert2';
import { ActivatedRoute } from  '@angular/router';
import { LoginService } from '../usuario/login.service' //importo el service donde creo la lista de clientes.
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import{ GlobalConstants } from '../common/globalConstant';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
// Agregar en app.module el patch de la pagina html con el component relacionado
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = []
  dataSource :  MatTableDataSource<Cliente>;


  displayedColumns: String[] = ['id', 'nombre', 'apellido', 'email','actions'];

  @ViewChild(MatSort) sort : MatSort;
  @ViewChild(MatPaginator) paginator : MatPaginator;

  variableGlobal = GlobalConstants.backendURL;
  variableImagenesGuardadas = GlobalConstants.backendURL + "/uploadFromUsers/";

//injeccion de dependencias
  constructor(public clienteService: ClienteService, 
    private activatedRoute: ActivatedRoute,
    public  loginService: LoginService) {}
//evento de cuando se inicia el componente


/**----------------------------------------------------------------------------------------------------------------------------------------------------------
  this.clientes = this.clienteService.getClientes() //utilizo la capa Service para obterner la lista de clientes. sinc, abajo ASINC con observador
 ---------------------------------------------------------------------------------------------------------------------------------------------------------*/
 

 ngOnInit(){
  this.clienteService.getAllClientes().subscribe(
     clientes => {
       this.clientes = clientes
       this.dataSource = new MatTableDataSource(clientes);
       this.dataSource.sort = this.sort
       this.dataSource.paginator = this.paginator
       console.log(this.clientes);
     }
   );

 }
/**- '=>'  es una function anonima. , se pordia poner        function clientes{... }...
    -clientes es la lista definida en la line 13

  */

//  ----------------------------------------------------------------------------------------------------------------------------------------------------------
  delete(cliente:Cliente): void{
    swal.fire({
      title: '¿Está seguro?',
      text: `¿Seguro que desea eliminar al colaborador ${cliente.nombre} ${cliente.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.deleteCliente(cliente.id).subscribe((Response) => {
            this.clientes = this.clientes.filter(cli => cli != cliente); // hacemos que de la lista de clientes desaparezca el eliminado, Filtrando sobre la lista. se veran todos los que son distintos  al cliente eliminado
            this.dataSource = new MatTableDataSource(this.clientes);

            swal.fire('Eliminado!', `El colaborador ${cliente.nombre} a sido eliminado.`, 'success');
        },

        err => {console.log('imprimo error');
                    console.log(err)
                    swal.fire('Ha ocurrido un error', err.error.message, 'error');
            })
      }
    })
  }
  applyFilter(event: Event) {
     const filterValue = (event.target as HTMLInputElement).value;
     this.dataSource.filter = filterValue.trim().toLowerCase();
   }
}
