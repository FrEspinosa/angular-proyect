import { Component, ViewChild} from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
  styleUrls: ['directiva.component.css'],


})
export class DirectivaComponent {

  name = 'Angular 6';

  displayedColumns = [ 'name', 'color', 'delete' ];
  dataSource =new MatTableDataSource(data);

  @ViewChild(MatTable) table: MatTable<any>;

  delete(row: any): void {
    const index = this.dataSource.data.indexOf(row, 0);
    if (index > -1) {
      this.dataSource.data.splice(index, 1);
    }
    console.log(this.table)
    this.table.renderRows();
  }
}

const data = [
  {
    name: "eggs",
    color: "white"
  },
  {
    name: "cheese",
    color: "yellow"
  },
  {
    name: "broccoli",
    color: "green"
  }
]