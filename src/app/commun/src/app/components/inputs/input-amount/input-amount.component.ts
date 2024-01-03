import {
  Component,
  EventEmitter,
  Injector,
  Input,
  Output,
  SimpleChanges,
  forwardRef,
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, NgControl, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { CmmCustomInput, CustomFieldErrorMatcher } from '../../../data/forms/models/input.models';
import { CmmErrorMessagesObject, CmmReplaceStringIndicator } from '../../../data/forms/models/inputs-messages';

@Component({
  selector: 'cmm-cmp-i-amount',
  templateUrl: './input-amount.component.html',
  styleUrls: ['./input-amount.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CmmInputAmountComponent),
      multi: true
    },
    {
      provide: NgControl,
      useValue: {},
    }
  ]
})
export class CmmInputAmountComponent implements CmmCustomInput {

  /**
   * Variables que vienen del componente que recibe el error de la peticion para el serverMsg
   */
  @Input() error: any;

  /**
   * Objeto con todos los mensajes de error base
   */
  CmmErrorMessagesObject = {...CmmErrorMessagesObject};

  /**
   * String para indicar qué parte del mensaje de erro será reemplazada
   */
  CmmReplaceStringIndicator = CmmReplaceStringIndicator;

  /**
   * Nombre corto de la moneda
   */
  @Input() currencyName: string = '';

  /**
   * Indicador de si se quiere usar decimales o no
   */
  @Input() useDecimals: boolean = true;

  /**
   * Información general de la moneda
   */
  @Input() currency = {
    nameCurrency: 'BS',
  };

  //? Lógica de customInput

  /**
   * Label del input
   */
  @Input() label: string = 'Monto';

  /**
   * Placeholder del input
   */
  @Input() placeholder: string = 'Ej: 10';

  /**
   * Valor del input
   */
  currentValue: string = '';

  /**
   * Variables minimo y maximo de longitud
   */
  @Input() minLength: number = 3;
  @Input() maxLength: number = 80;

  /**
   * Funciones para enviar información al formulario
   */
  onChange = (_:any) => {};
  onTouch = (_?:any) => {};

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
  required: boolean = false;

  /**
    * Variable que indica si se puede o ingresar valores en el input
    */
  @Input() readOnly: boolean = false;

  /**
   * Indica si el input sólo debe permitir números
   */
  @Input() onlyNumber: boolean = true;

  @Input() errors: any = null;

  /**
   * Indica si el input debe usar las propiedades y métodos de customInput
   */
  @Input()implementCustomInput: boolean = true;

  /**
   * Indica si el mat-form-field debe mostrar el espacio para el error siempre (fixed), o solo cuando halla error (dynamic)
   */
  @Input() subscriptSizing: 'fixed' | 'dynamic' = 'fixed';

  /**
   * Emite el evento de que hubo un cambio en el input
   */
  @Output() inputChange: EventEmitter<any>  = new EventEmitter();

  constructor(
    public injector: Injector,
  ) {}

  //? Métodos de ciclo de vida

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {}

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
  emitValue(): void {
    //* Emito el evento de touch formControl
    this.onTouch()

    //* Emito el evento de change formControl con la fecha formateada
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

  }

  /**
   * Retorna si el formControl tiene algún error
   * @returns
   */
  errorMatcher() {
    return new CustomFieldErrorMatcher(this.control,this.errors)
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
