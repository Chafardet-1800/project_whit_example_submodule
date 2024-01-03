import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

export type buttonType  = 'submit'|'reset'|'button'

@Component({
  selector: 'cmm-cmp-b-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class CmmButtonComponent {
  /**
   * Variable que trae el icono de carga
   */
  @Input() showSpinner: boolean = false;

  /**
   * Indica si el botón está deshabilitado
   */
  @Input() buttonDisabled: boolean = false

  /**
   * Indica qué tipo de botón es
   * @example "submit" | "reset" | "button"
   */
  @Input() type: buttonType = 'submit'

  /**
   * Variable que trae el texto para el boton
   */
  @Input() button_text: string = 'Continuar';

  /**
   * Variable que dice el tipo de boton que es
   */
  @Input() buttonType: string = 'success';
  /**
   * Variable que envia el evento de click al componente
   */
  @Output() submit: EventEmitter<boolean> = new EventEmitter();


  constructor() {}
}
