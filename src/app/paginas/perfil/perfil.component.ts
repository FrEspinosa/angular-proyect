import { Component, OnInit } from '@angular/core';

import { LoginComponent } from 'src/app/usuario/login.component';
import { LoginService } from 'src/app/usuario/login.service';

import { Cliente } from '../../../app/clientes/cliente';
import { ClienteService } from '../../clientes/cliente.service';

import { Usuario } from '../../usuario/usuario'


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {


  public cliente: Cliente = new Cliente(); // este atributo lo enriquece el ngModel del html (Binding) es bidireccional.
  public infoUsuarioLogueado;
  constructor(public servicioLogin : LoginService) { }

  ngOnInit(): void {

    console.log("Info sesion: " + sessionStorage.getItem('usuario'));
    this.infoUsuarioLogueado = JSON.parse(sessionStorage.getItem('usuario')) as Usuario

  }

   cargarCliente() {
    console.log(' FORM  notebooksSinAsignar');
  }

}
