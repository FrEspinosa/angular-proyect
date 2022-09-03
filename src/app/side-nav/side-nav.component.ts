import {ChangeDetectorRef, Component, OnDestroy, HostBinding , OnInit,ViewChild} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import { LoginService } from '../usuario/login.service';
import swal from 'sweetalert2';
import { Router } from  '@angular/router';
import { UntypedFormControl } from '@angular/forms';
import {OverlayContainer} from '@angular/cdk/overlay';

/** @title Responsive sidenav */
@Component({
  selector: 'app-sidenav',
  templateUrl: 'side-nav.component.html',
  styleUrls: ['side-nav.component.css'],
})
export class SideNavComponent implements OnDestroy, OnInit {

  @ViewChild('mySidenav')
  mySidenav: SideNavComponent;

  mobileQuery: MediaQueryList;

  toggleControl = new UntypedFormControl(false);

  private _mobileQueryListener: () => void;

  listaNav = [
        {name:"Perfil principal",route:"/perfil",icon:"account_box"},
        {name:"Colaboradores",route:"/clientes",icon:"badge"},
        {name:"Directiva",route:"/directivas",icon:"settings"},
        {name:"Notebooks",route:"/notebooks",icon:"laptop"}
  ]

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public loginService: LoginService, private router: Router, public overlay: OverlayContainer) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  @HostBinding('class') className = '';

   logout():void{
     let username = this.loginService.usuario.username
     this.loginService.logout();
     this.router.navigate(['/login'])
     swal.fire('Cerrar sesion', `${username} has cerrado sesion con exito!`, 'success')
   }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);

    this.toggleControl.valueChanges.subscribe((darkMode) => {
         const darkClassName = 'darkMode';
         this.className = darkMode ? darkClassName : '';
       });
  }

  shouldRun =true;

  ngOnInit() {
    this.toggleControl.valueChanges.subscribe((darkMode) => {
      const darkClassName = 'darkMode';
      this.className = darkMode ? darkClassName : '';
      if (darkMode) {
        this.overlay.getContainerElement().classList.add(darkClassName);
      } else {
        this.overlay.getContainerElement().classList.remove(darkClassName);
      }
    });
  }


  isShowing: boolean;

toggleSidenav() {
   this.isShowing = !this.isShowing;
}

callMethods() {
    this.toggleSidenav();
}

}


/**  Copyright 2021 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at https://angular.io/license */
