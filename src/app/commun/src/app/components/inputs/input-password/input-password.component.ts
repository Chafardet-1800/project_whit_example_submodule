import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Injector, Input, Output, SimpleChanges, forwardRef } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, NgControl, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Subject } from 'rxjs';
import { CmmCustomInput, CustomFieldErrorMatcher } from '../../../data/forms/models/input.models';
import {
  CmmErrorMessagesObject,
  CmmReplaceStringIndicator,
} from '../../../data/forms/models/inputs-messages';

@Component({
  selector: 'cmm-cmp-i-password',
  templateUrl: './input-password.component.html',
  styleUrls: ['./input-password.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CmmInputPasswordComponent),
      multi: true
    },
    {
      provide: NgControl,
      useValue: {},
    }
  ],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('0.5s ease-out', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1 }),
        animate('0.5s ease-in', style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
})
export class CmmInputPasswordComponent implements CmmCustomInput {

  /**
   *  variables exportadas con los mensajes de error que se van a usar en los inputs
   */
  CmmErrorMessagesObject = { ...CmmErrorMessagesObject };
  CmmReplaceStringIndicator = CmmReplaceStringIndicator;

  /**
   * Variable minimo de longitud
   */
  @Input() minLength: number = 3;
  /**
   * Variable de máximo de longitud
   */
  @Input() maxLength: number = 80;

  /**
   * Mensajes de ayuda con el respectivo error para validar si cumple la condición
   */
  @Input() validatorMessages: any[] = [
    {
      message: 'Debe contener mínimo 8 caracteres',
      error: 'minLength',
    },
    {
      message: 'Debe contener al menos una minúscula (a-z)',
      error: 'minus',
    },
    {
      message: 'Debe contener al menos una mayúscula (A-Z)',
      error: 'mayus',
    },
    {
      message: 'Debe contener al menos un número (0-9)',
      error: 'num',
    },
    {
      message: 'El campo no permite espacios',
      error: 'space',
    },
    {
      message: 'Debe contener al menos un carácter especial.',
      error: 'espec',
    },
    {
      message: 'No debe tener más de 3 caracteres iguales consecutivos',
      error: 'threeChar',
    },
    {
      message: 'No debe tener acentos',
      error: 'accent',
    },
    {
      message: 'No debe contener datos personales del usuario, ni el nombre de la empresa',
      error: '',
    },
    {
      message: 'No debe ser ninguna de las últimas 5 contraseñas colocadas.',
      error: '',
    },
  ]

  /**
   * Indica si se oculta la contraseña
   */
  hidePassword: boolean = true;

  /**
   * Indica si mostramos los mensajes de ayuda para validar contraseña
   */
  @Input() showAssistanceMessages: boolean = false

  //? Lógica de controlValueAccessor

  /**
   * Placeholder del input
   */
  @Input() placeholder: string = '';

  /**
   * Label del input
   */
  @Input() label: string = '';

  /**
   * Valor del input
   */
  currentValue: string = ''

  /**
   * Función para enviar nuevo valor al formControl
   * @param _
   */
  onChange = (_: any) => { }

  /**
   * Función para enviar evento de touched al formControl
   * @param _
   */
  onTouch = (_?: any) => { }

  /**
   * Indica si está deshabilitado el input
   */
  disabled: boolean = false;

  /**
   * FormControl asociado a este input
   */
  control!: FormControl;

  /**
   * Indica si el input tiene la validación de required
   */
  required: boolean = false

  /**
    * Variable que indica si se puede o ingresar valores en el input
    */
  @Input() readOnly: boolean = false;

  /**
   * Indica si el input sólo debe permitir números
   */
  @Input() onlyNumber: boolean = false

  /**
   * Indica si el input tiene un error
   */
  @Input() errors: any = null;

  /**
   * Indica si el input debe usar las propiedades y métodos de esta clase
   */
  @Input() implementCustomInput: boolean = true;

  /**
   * Indica si el mat-form-field debe mostrar el espacio para el error siempre (fixed), o solo cuando halla error (dynamic)
   */
  @Input() subscriptSizing: 'fixed' | 'dynamic' = 'fixed';

  /**
   * Emite el evento de que hubo un cambio en el input
   */
  @Output() inputChange: EventEmitter<any> = new EventEmitter()

  constructor(
    public injector: Injector,
  ) {

  }

  //? Métodos de ciclo de vida

  ngOnInit(): void {

    //* Modifico los mensajes de error
    this.replaceErrorMessages()

  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngAfterViewInit(): void {
    //*Obtengo acceso al formControl que haya sido bindeado a este input
    const ngControl: NgControl = this.injector.get(NgControl);

    if (ngControl) {
      //*Espera un poco para obtener el formControl
      setTimeout(() => {
        this.control = ngControl.control as FormControl;
        this.required = this.control?.hasValidator(Validators.required)
      })
    }
  }

  /**///////////////////////////////////////////////////////////////////////////////  */

  //? Métodos de controlValueAccessor

  /**
   * Recibe valores puestos al formControl
   * @param obj El valor que tiene el formControl
   */
  writeValue(obj: any): void {
    //* Emito el evento de touch formControl
    this.onTouch()

    //* Le doy valor al input
    this.currentValue = obj
  }

  /**
   * Registra una función callBack que se usará para emitir cambios al formControl
   * @param fn
   */
  registerOnChange(fn: any): void {
    this.onChange = fn
  }
  /**
   * Registra una función callBack que se usará para emitir señales de touched o blur al formControl
   * @param fn
   */
  registerOnTouched(fn: any): void {
    this.onTouch = fn
  }
  /**
   * Recibe la señal de si el formControl ha sido deshabilitado o habilitado
   * @param isDisabled
   */
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled
  }

  /**///////////////////////////////////////////////////////////////////////////////  */

  /**
  * Le envía al formControl el nuevo valor del input
  */
  emitValue() {
    //* Emito el evento de touch formControl
    this.onTouch()

    //* Emito el evento de change formControl
    this.onChange(this.currentValue)

    //* Emito evento de cambio de valor
    this.inputChange.emit()
  }

  /**///////////////////////////////////////////////////////////////////////////////  */

  //? Lógica de manejo de errores

  /**
   * Se encarga de personalizar los mensajes de error del input
   */
  replaceErrorMessages() {
    // Remplazo los mensajes de error con el minimo y maximo que corresponda
    this.CmmErrorMessagesObject.minLength =
      this.CmmErrorMessagesObject.minLength.replace(
        this.CmmReplaceStringIndicator,
        String(this.minLength)
      );

    // Remplazo los mensajes de error con el minimo y maximo que corresponda
    this.CmmErrorMessagesObject.maxLength =
      this.CmmErrorMessagesObject.maxLength.replace(
        this.CmmReplaceStringIndicator,
        String(this.maxLength)
      );
    this.control?.updateValueAndValidity()
  }

  /**
   * Retorna si el formControl tiene algún error
   * @returns
   */
  errorMatcher() {
    return new CustomFieldErrorMatcher(this.control, this.errors)
  }

  readonly errorStateMatcher: ErrorStateMatcher = {
    isErrorState: (ctrl: FormControl) => (ctrl && ctrl.invalid)
  };

  /**///////////////////////////////////////////////////////////////////////////////  */

  /**
   * Función que valida campo vacio
   */
  validateAllFormFields(control: FormControl) {
    control.markAsTouched({ onlySelf: true });
  }

}
