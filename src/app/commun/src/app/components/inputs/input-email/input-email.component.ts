import {
  Component,
  EventEmitter,
  Injector,
  Input,
  Output,
  SimpleChanges,
  forwardRef
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, NgControl, Validators } from '@angular/forms';
import { CmmCustomInput, CustomFieldErrorMatcher } from '../../../data/forms/models/input.models';
import {
  CmmErrorMessagesObject,
  CmmReplaceStringIndicator,
} from '../../../data/forms/models/inputs-messages';

@Component({
  selector: 'cmm-cmp-i-email',
  templateUrl: './input-email.component.html',
  styleUrls: ['./input-email.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CmmInputEmailComponent),
      multi: true
    },
    {
      provide: NgControl,
      useValue: {},
    }
  ]
})
export class CmmInputEmailComponent implements CmmCustomInput {

  //? Lógica de customInput

  /**
   * Valor del input
   */
  currentValue: string = '';
  /**
   * Placeholder del input
   */
  @Input() placeholder: string = '';

  /**
   * Label del input
   */
  @Input() label: string = '';

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
   * Variable minimo de longitud
   */
  @Input() minLength: number = 6;

  /**
   * Variable de máximo de longitud
   */
  @Input() maxLength: number = 254;

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
   * Objeto con todos los mensajes de error base
   */
  CmmErrorMessagesObject = { ...CmmErrorMessagesObject };

  /**
   * String para indicar qué parte del mensaje de error será reemplazada
   */
  CmmReplaceStringIndicator = CmmReplaceStringIndicator;

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
  ) { }

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

        //* Agrego el validator de email de una vez
        if(this.control) {
          this.addEmailValidator()
        }
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
   * Agrega la validación de email
   */
  addEmailValidator() {
    this.control?.addValidators(Validators.email)
    this.control?.updateValueAndValidity()
  }

  /**
   * Retorna si el formControl tiene algún error
   * @returns
   */
  errorMatcher() {
    return new CustomFieldErrorMatcher(this.control, this.errors)
  }

  /**///////////////////////////////////////////////////////////////////////////////  */

  /**
   * Función que valida campo vacio
   */
  validateAllFormFields(control: FormControl) {
    control.markAsTouched({ onlySelf: true });
  }

}
