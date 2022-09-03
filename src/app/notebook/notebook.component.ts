import { Component, OnInit, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { Notebook } from './notebook';
import { NotebookService } from './notebook.service';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../usuario/login.service';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ModalService } from '../notebook/modal/modal.service';
import { FormComponent } from '../clientes/form.component';

import { fadeOut } from '../animations/template.animations';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-notebook',
  templateUrl: './notebook.component.html',
  styleUrls: ['./notebook.component.css'],
  animations: [fadeOut],

})
export class NotebookComponent implements OnInit {
  //los input  marca un campo de clase como una propiedad de entrada, cuando invoco la lista de notebook (Boton agregar) en FormEmpleado, cargo este componente con este DS nuevo.
  // DS utilizado para el modal de Notebooks disponibles para asignar.
  @Input() dataSourceModal: MatTableDataSource<Notebook>;

  notebooks: Notebook[];
  dataSource = new MatTableDataSource<Notebook>([]);

  displayedColumns: String[] = ['id', 'fusapId', 'marca', 'modelo', 'procesador', 'ram', 'estado', 'actions'];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginator1: MatPaginator;
  @ViewChild(MatTable) table: MatTable<any>;

  notebookElegidaParaAsignar: Notebook;
  errores: string[];

  constructor(private changeDetectorRefs: ChangeDetectorRef,
    public modalService: ModalService,
    private notebookService: NotebookService,
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
    private formComponent: FormComponent
  ) { }

  ngAfterViewInit() {
    //pagino el datasource al final de cargar la pag, sino no anda.
    // el if es para que cuando cargue la lista general de notebook, no accione.
    if (this.modalService.modal) {
      this.dataSourceModal.sort = this.sort;
      this.dataSourceModal.paginator = this.paginator1;
    }
  }
  ngOnInit() {
    this.modalService.cerrarModal
    this.getAllNotebook();//quite el getAllNotebook() porque me pisaba la lista de "Disponibles" en el Modal par aasignar a un colaborador.
  }

  getAllNotebook() {
    this.notebookService.getAllNotebooks().subscribe((notebooks) => {
      this.notebooks = notebooks;
      this.dataSource = new MatTableDataSource(notebooks);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  delete(notebook: Notebook): void {
    swal
      .fire({
        title: '¿Está seguro?',
        text: `¿Seguro que desea eliminar al notebook ${notebook.fusapId} - ${notebook.marca}?`,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'No, cancelar!',
        confirmButtonText: 'Si, eliminar!',
        reverseButtons: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.notebookService.deleteNotebook(notebook.id).subscribe((Response) => {
            this.notebooks = this.notebooks.filter((cli) => (cli !== notebook)); // hacemos que de la lista de notebooks desaparezca el eliminado, Filtrando sobre la lista. se veran todos los que son distintos  al notebook eliminado
            this.deleteRow(notebook);

            swal.fire('Eliminado!',`Su notebook ${notebook.fusapId} - ${notebook.marca} ha sido eliminada.`,'success');

          },
            err => {console.log('imprimo error');
                    console.log(err)
                    swal.fire(err.error.mensaje, err.error.detalle, 'error');
            }
          );
        }
        {
          console.log()
          swal.fire('Cancelado', 'No se ha elimino ninguna notebook', 'error');
        }
      });
  }

  deleteRow(row: any): void {
    const index = this.dataSource.data.indexOf(row, 0);
    console.log("index " + index)
    if (index > -1) {
      this.dataSource.data.splice(index, 1);
      this.dataSource.paginator = this.paginator;//vuelvo a paginar para que refreque el splice(

    }
    this.table.renderRows();
  }

  applyFilter(filterValue: String) {
    console.log('aca');
    console.log(filterValue);
    this.dataSource.filter = filterValue.trim()
    this.formComponent.DSNotebookDisp.filter = filterValue.trim();
  }

  FilterNotebookDisp(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.formComponent.DSNotebookDisp.filter = filterValue.trim().toLowerCase();
  }

  cerrarModal() {
    this.modalService.cerrarModal();
    //si no vacio la proxima lista, se me carga la lista de ntoebooks , ya que la visibilidad se basa en la lista que hereda de ese componente
    this.formComponent.notebookDisponibles = [];
  }



  applyFilter2(e) {
    if (e.target.checked) {
      console.log('TRUE')
      
      const filterValue = 'false';
      this.dataSource.filter = filterValue.trim().toLowerCase();
      this.formComponent.DSNotebookDisp.filter = filterValue.trim().toLowerCase();
    } else {
      console.log('FALSE')

      const filterValue = '';
      this.dataSource.filter = filterValue.trim().toLowerCase();
      this.formComponent.DSNotebookDisp.filter = filterValue.trim().toLowerCase();
    }
  }



}
