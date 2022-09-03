import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import swal from 'sweetalert2';
import { LoginService } from './login.service';
import { Router } from  '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']

})
export class LoginComponent implements OnInit {

  titulo:String = "Por favor, inicia sesion!";
  usuario: Usuario;

  constructor(private loginService: LoginService, private router: Router) {
    this.usuario = new Usuario;
  }

  ngOnInit(): void {
    if(this.loginService.isAuthenticated()){
      swal.fire('Login', `Hola ${this.loginService.usuario.username} ya estas autenticado!`, 'info')
      this.router.navigate(['/clientes'])
    }
  }



  login():void {
    console.log(this.usuario)
    if(this.usuario.username == null || this.usuario.password == null || this.usuario.username == '' || this.usuario.password == '' )  {
      swal.fire('Error login', 'Usuario o password vacios', 'error')
      return;
    }
    this.loginService.login(this.usuario).subscribe(response => {
      console.log('LOG' + response);
        console.log(response);

// guardamos enb sesionStorage
      this.loginService.guardarUsuario(response.access_token);
      this.loginService.guardarToken(response.access_token);

      let usuario = this.loginService.usuario;//es el public GET, por eso no usamos parentesis (), parece un metodo pero no.
      this.router.navigate(['/clientes'])
      swal.fire('Bienvenido!', `Hola ${usuario.nombre}, has iniciado sesion con exito!`, 'success');
    }, err =>{
      console.log(err)
      if(err.statusText == "Unknown Error")
      {
        swal.fire('Error login', 'No se encontró backend', 'error')

      }
      if(err.status == 400){
        swal.fire('Error login', 'Usuario o password incorrectos', 'error')
      }
    }
  );
  }
}
