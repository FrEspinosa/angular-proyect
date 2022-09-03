import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  public modal: boolean = false;
  constructor() { }

  abrirModal(){
    this.modal = true 
    console.log(this.modal)
  }

  cerrarModal(){
    this.modal = false
    console.log(this.modal)

  }
}
