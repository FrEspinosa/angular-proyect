import { Notebook } from '../notebook/notebook'

export class Cliente {
  id: number;
  nombre: string;
  apellido: string;
  fechaIngreso: string;
  email: string;
  fotoPerfil: string;
  notebooks : [Notebook];
}
