import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { coverEmptyState } from '../../../../assets/images/images-routes';

@Component({
  selector: 'cmm-cmp-t-cover',
  templateUrl: './table-cover.component.html',
  styleUrls: ['./table-cover.component.scss'],
})
export class CmmTableCoverComponent {

  /**
   * Mensaje del cover
   */
  @Input() messageCover:
    | string /*= 'Comience a realizar sus primeras transacciones';*/
    | undefined; /*= 'Comience a realizar sus primeras transacciones';*/

  /**
   * Información para el botón del cover (texto, link)
   */
  @Input() elementButton: {
    text: string;
    textLink: string;
    show: boolean;
  } = {
    text: '',
    textLink: '',
    show: false,
  };

  /**
   * Emite el evento de click del botón
   */
  @Output() emitActionEvent: EventEmitter<boolean> = new EventEmitter();

  /**
   * IMAGEN
   */
  coverEmptyState = coverEmptyState;

  constructor(private router: Router) {}

  /**
   * Emite la acción del botón
   */
  emitAction() {

    //* En caso de que el botón tenga un link, nos redirige a esa url
    if (this.elementButton.textLink) {
      this.router.navigate([this.elementButton.textLink]);
    }

    //* Emito el evento
    this.emitActionEvent.emit(true);
  }

  ngOnDestroy() {
    this.messageCover = '';
  }
}
