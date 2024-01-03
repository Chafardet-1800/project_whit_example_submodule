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
import { CmmCustomInput, CustomFieldErrorMatcher } from '../../../data/forms/models/input.models';
import {
  CmmErrorMessagesObject,
  CmmReplaceStringIndicator,
} from '../../../data/forms/models/inputs-messages';

@Component({
  selector: 'cmm-cmp-i-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CmmInputTextComponent),
      multi: true
    },
    {
      provide: NgControl,
      useValue: {},
    }
  ]
})
export class CmmInputTextComponent implements CmmCustomInput {

  //? Lógica de controlValueAccessor

  /**
   * Label del input
   */
  @Input() label: string = '';


  /**
   * Placeholder del input
   */
  @Input() placeholder: string = '';

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
   * Variable minimo de longitud
   */
  @Input() minLength: number = 3;
  /**
   * Variable de máximo de longitud
   */
  @Input() maxLength: number = 80;

  /**
   * Mensaje de reemplazo en el mensaje de error de tipo pattern, reemplaza el $ en el mensaje de error original
   */
  @Input() replaceMessage = ''

  /**
   * Indica el tipo de mensaje de error para el validator pattern
   * @example 'incorrectPattern' => 'Debe introducir un $ válido'
   * @example 'allowedValues' => 'Este campo solo puede tener $'
   * @example 'notAllowedValues' => 'Este campo no puede tener $'
   */
  @Input() patternMessageType: 'incorrectPattern' | 'allowedValues' | 'notAllowedValues' = 'incorrectPattern'

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

  //? Control de directiva para formato de texto

  /**
   * Indica si el input sólo debe permitir números
   */
  @Input() onlyNumber: boolean = false

  /**
   * Input para indicar si se quiere que se pueda copiar los datos del input
   */
  @Input() allowCopy: boolean = false;

  /**
   * Input para indicar si se quiere que se pueda cortar los datos del input
   */
  @Input() allowCut: boolean = false;

  /**
   * Input para indicar si se quiere que se pueda hacer click en el campo del input
   */
  @Input() allowClicWithMouse: boolean = false;

  constructor(
    public injector: Injector,
  ) { }

  //? Métodos de ciclo de vida

  ngOnInit(): void {

    this.replaceErrorMessages()

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['minLength'] && this.minLength) {
      this.replaceErrorMessages()
    }

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
   * Se encarga de modificar todos los mensajes de error
   */
  replaceErrorMessages() {
    //*Copio el objeto base de los mensajes de error
    let baseMessage = CmmErrorMessagesObject

    this.CmmErrorMessagesObject = { ...baseMessage }

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

    //* Reemplazo el nombre del tipo de texto en el que se evalúa el patrón
    this.CmmErrorMessagesObject[this.patternMessageType] = this.CmmErrorMessagesObject[this.patternMessageType].replace(
      this.CmmReplaceStringIndicator,
      this.replaceMessage
    )

    this.control?.updateValueAndValidity()
  }

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
