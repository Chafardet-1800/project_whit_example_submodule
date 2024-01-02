import { Component } from '@angular/core';
import { boAuthCover } from 'commun/src/assets/images/images-routes';

@Component({
  selector: 'pag-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
})
export class AuthLayoutComponent {

  /**
   * IMAGENES
   */
  boAuthCover = boAuthCover;

}
