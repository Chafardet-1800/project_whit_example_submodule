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
import { timer } from 'rxjs';
import { CmmCustomInput, CustomFieldErrorMatcher } from '../../../data/forms/models/input.models';
import {
  CmmErrorMessagesObject,
  CmmReplaceStringIndicator,
} from '../../../data/forms/models/inputs-messages';
import { CmmDataService } from '../../../services/data.service';

@Component({
  selector: 'cmm-cmp-i-otp',
  templateUrl: './input-otp.component.html',
  styleUrls: ['./input-otp.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CmmInputOtpComponent),
      multi: true
    },
    {
      provide: NgControl,
      useValue: {},
    }
  ]
})
export class CmmInputOtpComponent implements CmmCustomInput {

  //? Lógica de controlValueAccessor

  /**
   * Placeholder del input
   */
  @Input() placeholder: string = '';

  /**
   * Label del input
   */
  @Input() label: string = 'Solicitar código';

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
   * Mensaje de reemplazo en el mensaje de error de tipo pattern
   */
  @Input() replaceMessage = ''

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

  //? Lógica de OTP

  /**
   * Emite la señal de click del botón
   */
  @Output() submitRequest: EventEmitter<any> = new EventEmitter()


  /**
   * Texto del botón
   */
  buttonText: string = 'Solicitar'

  /**
   * Indica si muestro el spinner del botón
   */
  showButtonSpinner: boolean = false

  /**
   * Indica si se pidió el token
   */
  @Input() tokenRequested: boolean = false

  //? Lógica del temporizador

  /**
   * Tiempo de recarga del botón
   */
  @Input() reloadTime: number = 120

  /**
   * Tiempo que queda para rehabilitar el botón
   */
  timeLeft: number = 0

  constructor(
    public injector: Injector,
    public dataService: CmmDataService
  ) { }

  //? Métodos de ciclo de vida

  ngOnInit(): void {

    //* Modifico los mensajes de error
    this.replaceErrorMessages()

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tokenRequested'] && this.tokenRequested) {

      //* Empiezo el contador
      this.startTimer()

      this.label = 'Código enviado a su correo o teléfono'
      setTimeout(() => {
        this.showButtonSpinner = false
      }, 1000);

      //*Timer del botón de solicitar
      let countDown = setInterval(() => {
        if (!this.timeLeft) {
          clearInterval(countDown)
          this.label = 'Solicitar'
        }
      }, 1000)
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
  replaceErrorMessages(): void {
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
    this.CmmErrorMessagesObject.incorrectPattern = this.CmmErrorMessagesObject.incorrectPattern.replace(
      this.CmmReplaceStringIndicator,
      this.replaceMessage
    )
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

  //? Lógica de OTP

  /**
   * Inicia el con
   * @param reloadTime
   */
  startTimer() {

    //* Incrementa el contador por 1 cada segundo
    const counter = timer(1000, 1000);

    //* Me suscribo al timer que aumenta el contador
    const timerObservable = counter.subscribe( (val) => {

      //* Actualizo el tiempo restante
      this.timeLeft = this.reloadTime - val;

      //* Cuando el tiempo llegue a cero, detengo el proceso
      if (this.timeLeft == 0) {

        //* Detengo el proceso
        timerObservable.unsubscribe();

      }

    });

  }

  /**
   * Envía la señal de click del botón
   */
  requestCode() {
    this.showButtonSpinner = true
    this.submitRequest.emit()
  }

}
