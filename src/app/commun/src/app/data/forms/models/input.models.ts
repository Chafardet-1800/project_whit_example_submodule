import { EventEmitter, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { ControlValueAccessor, FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

/**
 * Detecta errores en los fomrControl
 */
export class CustomFieldErrorMatcher implements ErrorStateMatcher {
  constructor(private customControl: FormControl, private errors: any) { }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return this.customControl && this.customControl.touched && (this.customControl.invalid || this.errors);
  }
}

/**
 * Tipos de extension de archivo que contienen una imagen
 */
export const imgFileTypes: string[] = ['png', 'svg', 'jpg', 'jpeg', 'svg+xml']

/**
   * Regex para validar primeros 4 dígitos de teléfono venezolano
   */
export const phoneRegex: string = '(0424|0414|0412|0426|0416|424|414|412|426|416)+([0-9]{6,7})'

/**
 * Lógica general que debe ser aplicada a todos los inputs custom
*/
export declare interface CmmCustomInput extends OnInit, OnChanges, ControlValueAccessor {

  /**
   * Label del input
   * @Input
   */
  label: string

  /**
   * Placeholder del input
   * @Input
   */
  placeholder: string

  /**
   * Valor del input
   */
  currentValue: string

  /**
   * Función para enviar nuevo valor al formControl
   * @param _
   */
  onChange: Function
  /**
   * Función para enviar evento de touched al formControl
   * @param _
   */
  onTouch: Function

  /**
 * Variable minimo de longitud
 * @Input
 */
  minLength?: number
  /**
   * Variable de máximo de longitud
   * @Input
   */
  maxLength?: number

  /**
   * Indica si está deshabilitado el input
   */
  disabled: boolean

  /**
   * FormControl asociado a este input
   */
  control: FormControl;

  /**
   * Indica si el input tiene la validación de required
   */
  required: boolean

  /**
   * Objeto con todos los mensajes de error base
   */
  CmmErrorMessagesObject: any

  /**
   * String para indicar qué parte del mensaje de error será reemplazada
   */
  CmmReplaceStringIndicator: string

  /**
  * Variable que indica si se puede o ingresar valores en el input
  * @Input
  */
  readOnly: boolean

  /**
   * Indica si el input sólo debe permitir números
   */
  onlyNumber: boolean

  /**
   * Indica si el input tiene un error
   * @Input
   */
  errors: any

  /**
   * Indica si el input debe usar las propiedades y métodos de esta clase
   * @Input
   */
  implementCustomInput: boolean

  /**
   * Indica si el mat-form-field debe mostrar el espacio para el error siempre (fixed), o solo cuando halla error (dynamic)
   * @Input
   */
  subscriptSizing: 'fixed' | 'dynamic'

  /**
   * Emite el evento de que hubo un cambio en el input
   * @Output
   */
  inputChange: EventEmitter<any>

  //? Métodos de ciclo de vida

  ngOnInit(): void

  ngOnChanges(changes: SimpleChanges): void

  ngAfterViewInit(): void

  /**///////////////////////////////////////////////////////////////////////////////  */

  //? Métodos de controlValueAccessor

  writeValue(obj: any): void

  registerOnChange(fn: any): void

  registerOnTouched(fn: any): void

  setDisabledState?(isDisabled: boolean): void

  /**
  * Le envía al formControl el nuevo valor del input
  */
  emitValue(): void

  /**///////////////////////////////////////////////////////////////////////////////  */

  //? Lógica de manejo de errores

  /**
   * Se encarga de personalizar los mensajes de error del input
   */
  replaceErrorMessages(): void

  /**
   * Retorna si el formControl tiene algún error
   * @example return new CustomFieldErrorMatcher(this.control,this.errors)
   */
  errorMatcher(): CustomFieldErrorMatcher

}
