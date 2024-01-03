import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CmmSnackbarCenteredComponent } from '../../dialogs/snackbar-centered/snackbar-centered.component';

@Component({
  selector: 'cmm-cmp-t-actions',
  templateUrl: './table-actions.component.html',
  styleUrls: ['./table-actions.component.scss'],
})
export class CmmTableActionsComponent {
  /**
   * Nombre de la acción implementada
   */
  @Input() actionSelected: string | undefined;

  /**
   * Contiene la información que se le haya pasado a la celda de acción
   */
  @Input() element: any;

  /**
   * Indica si la celda de detalle está expandida
   */
  @Input() expandedElement: boolean | undefined = true;

  /**
   * Emite evento de la acción
   */
  @Output() emitValue = new EventEmitter();

  /**
   * Emite evento de expandir detalle
   */
  @Output() emitExpanded = new EventEmitter();

  constructor(
    private snackBar: MatSnackBar,
  ) {}

  /**
   * Envio el evento de que se clickeo un elemento
   */
  emitAction() {
    this.emitValue.emit(this.element);
  }
  /**
   * Envio el evento de que se clickeo un elemento
   */
  emitExpansion() {
    this.emitExpanded.emit(this.element);
  }

 /**
  * Función que copia al porta papeles lo escrito en la etiqueta que tenga el id
  * @param id
  */
 copyText(id: string) {
  // Crea un campo de texto "oculto"
  var aux = document.createElement("input");

  // Asigna el contenido del elemento especificado al valor del campo
  aux.setAttribute("value", document.getElementById(id)!.innerHTML);

  // Añade el campo a la página
  document.body.appendChild(aux);

  // Selecciona el contenido del campo
  aux.select();

  // Copia el texto seleccionado
  document.execCommand("copy");

  // Elimina el campo de la página
  document.body.removeChild(aux);

  this.snackBar.openFromComponent(CmmSnackbarCenteredComponent, {
    duration: 2000,
    data: 'Infomacion copiada'
  })
}
}
