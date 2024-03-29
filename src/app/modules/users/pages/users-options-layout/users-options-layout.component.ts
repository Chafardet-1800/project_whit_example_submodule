import { Component } from '@angular/core';
import { coverApproved } from 'src/app/common/assets/images/images-routes';
import { CmmModuleActionOption } from 'src/app/common/data/privileges/models/privileges.models';

@Component({
  selector: 'pag-users-options-layout',
  templateUrl: './users-options-layout.component.html',
  styleUrls: ['./users-options-layout.component.scss']
})
export class UsersOptionsLayoutComponent {

  /**
   * Variable que contiene el arreglo de opciones que se quieren mostrar en la lista
   */
  operationOptions: CmmModuleActionOption[] = [
    {
      title: 'Formulario',
      subtitle: 'Ejemplo de formulario',
      url: 'users/form',
      imgUrl: coverApproved,
      imgDimentions: {width: 100, height: 100}
    },
    {
      title: 'Tabla',
      subtitle: 'Ejemplo de tabla',
      url: 'users/list',
      imgUrl: coverApproved,
      imgDimentions: {width: 100, height: 100}
    },
  ];

}
