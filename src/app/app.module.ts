import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


//COMPONENTES PROPIOS
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { ClientesComponent } from './clientes/clientes.component'
import { FormComponent } from './clientes/form.component'; //Permite conectar nuestro Front(angular) con el Back(Spring).
import { SideNavComponent } from './side-nav/side-nav.component';
import { NotebookComponent } from './notebook/notebook.component';
import { FormNotebookComponent } from './notebook/form-notebook/form-notebook.component';

import { RouterModule, Routes } from '@angular/router'; //permite el routeo / uri
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { registerLocaleData } from '@angular/common'
import localeES from '@angular/common/locales/es';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './usuario/login.component';
import { AuthGuard } from './usuario/guards/auth.guard';
import { RoleGuard } from './usuario/guards/role.guard';
// material design
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatFormFieldModule, } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSortModule} from '@angular/material/sort';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';


//interceptor  de REQ/RESP para enviar el token
import { TokenInterceptor } from './usuario/interceptors/tokenInterceptor';
import { AuthInterceptor } from './usuario/interceptors/auth.Interceptor';
import {OverlayModule} from '@angular/cdk/overlay';
import {LayoutModule} from '@angular/cdk/layout';
// manejar responsiove las grid, 
import { FlexLayoutModule } from "@angular/flex-layout";
import { PerfilComponent } from './paginas/perfil/perfil.component';


// FORMBUILDER
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


registerLocaleData(localeES, 'es')
/** en este arreglo de rutas vamos ad efinir las rutas, url de cada componente de nuestr  APP.
luego, registrar los import de estas rutas usando el RouterModule en 'imports' abajo
 */
const routes: Routes = [
  {path: '', redirectTo:'/login', pathMatch:'full'},
  {path: 'directivas', component: DirectivaComponent },
  {path: 'clientes', component: ClientesComponent, canActivate:[AuthGuard, RoleGuard],data:{role:['ROLE_USER', 'ROLE_ADMIN']} },
  {path: 'clientes/page/:page', component: ClientesComponent },
  {path: 'clientes/form', component: FormComponent, canActivate:[AuthGuard, RoleGuard],data:{role:['ROLE_ADMIN']} },
  {path: 'clientes/form/:id', component: FormComponent, canActivate:[AuthGuard, RoleGuard],data:{role:['ROLE_ADMIN']} },
  {path: 'clientes/ficha/:id', component: FormComponent, canActivate:[AuthGuard, RoleGuard],data:{role:['ROLE_USER']} },

  {path: 'notebooks', component: NotebookComponent, canActivate:[AuthGuard, RoleGuard],data:{role:['ROLE_USER', 'ROLE_ADMIN']} },
  {path: 'notebooks/form', component: FormNotebookComponent, canActivate:[AuthGuard, RoleGuard],data:{role:['ROLE_USER', 'ROLE_ADMIN']} },
  {path: 'notebook/form/:id', component: FormNotebookComponent, canActivate:[AuthGuard, RoleGuard],data:{role:['ROLE_ADMIN']} },
  {path: 'notebook/ficha/:id', component: FormNotebookComponent, canActivate:[AuthGuard, RoleGuard],data:{role:['ROLE_ADMIN']} },

  {path: 'login', component: LoginComponent },

  {path: 'perfil', component: PerfilComponent, canActivate:[AuthGuard, RoleGuard],data:{role:['ROLE_USER', 'ROLE_ADMIN']} },

];

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormComponent,
    PerfilComponent,
    LoginComponent,
    SideNavComponent,
    NotebookComponent,
    FormNotebookComponent

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),//registro las rutas/patch
    FontAwesomeModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTableModule,
    MatSidenavModule,
    MatSortModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatSlideToggleModule,
    OverlayModule,
    MatGridListModule,
    LayoutModule,
    MatDialogModule,
    FlexLayoutModule,
    MatCheckboxModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary){
    library.addIconPacks(fas,far)
  }
 }
