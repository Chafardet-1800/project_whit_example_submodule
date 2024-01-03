import {
  Component,
  EventEmitter,
  Inject,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  forwardRef,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, NG_VALUE_ACCESSOR, NgControl, Validators } from '@angular/forms';
import { DateAdapter, ErrorStateMatcher, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
// import * as moment from 'moment';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { } from '@angular/material/core';
import { CmmCustomInput, CustomFieldErrorMatcher } from '../../../data/forms/models/input.models';
import { CmmErrorMessagesObject, CmmReplaceStringIndicator } from '../../../data/forms/models/inputs-messages';

@Component({
  selector: 'cmm-cmp-i-date',
  templateUrl: './input-date.component.html',
  styleUrls: ['./input-date.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CmmInputDateComponent),
      multi: true
    },
    {
      provide: NgControl,
      useValue: {},
    },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },]
})
export class CmmInputDateComponent implements OnInit, OnChanges, OnDestroy, CmmCustomInput {

  //? Lógica de customInput

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
  currentValue: string = '';

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
  @Input() readOnly: boolean = true;

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

  //? Lógica de manejo de fechas

  /**
   * Variable que establece la fecha de inicio del campo de fecha
   */
  startDate: any;
  /**
   * Variable que establece la fecha mínima del campo de fecha
   */
  minDate!: Date;

  /**
   * Variable que recibe el filtro
   * 0 es para mayor a 18
   * 1 es para dias antes del dia actual
   * 2 es para dias despues del dia actual
   */
  @Input() typeFilterDate: number = 1;

  /**
   * Formato de fecha en el que saldrán los valores de fecha
   */
  @Input() toLocaleDateString: string = 'es-ES'

  /**
   * Modo de selección de fecha
   */
  @Input() selectDateMode: 'single' | 'range' = 'single'

  /**
   * FormControls para el input de fecha en modo rango
   */
  @Input() rangeControls: string[] = []

  /**
   * Formulario que tendrá los controls de fecha inicial y final
   */
  @Input() rangeControlsGroup!: FormGroup

  /**
   * Formulario padre de este input
   */
  @Input() group!: FormGroup

  /**
   * Máxima fecha permitida
   */
  @Input() daterange: any = new Date()

  /**
   * Emite el evento de que hubo un cambio en el input
   */
  @Output() inputChange: EventEmitter<any> = new EventEmitter()

  constructor(
    public injector: Injector,
    // private datePipe: DatePipe
    private _adapter: DateAdapter<any>,
    private parentForm: FormGroupDirective,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
  ) {
    this.spanish()
  }

  //? Métodos de ciclo de vida

  ngOnInit(): void {
    let dateAdult = new Date();

    //*Seteo la fecha mínima aceptada
    this.minDate = new Date(
      new Date().getFullYear() - 120,
      dateAdult.getMonth(),
      dateAdult.getDate()
    );

    //*Seteo el startDate con los valores que tenga
    if (this.typeFilterDate == 1 || this.typeFilterDate == 2) {
      this.startDate = new Date();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['typeFilterDate']) {
      //* Seteo la startDate dependiendo del tipo de filtro
      switch (this.typeFilterDate) {
        case 0:
          let dateAdult = new Date();
          this.startDate = new Date(
            dateAdult.getFullYear() - 18,
            dateAdult.getMonth(),
            dateAdult.getDate()
          );
          break;
        case 1:
          this.startDate = new Date();
          break;
        case 2:
          this.startDate = new Date();
          break;
      }
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

        if (this.selectDateMode == 'range') {
          this.createRangeDateGroup()
        }
      })
    }
  }

  ngOnDestroy(): void {
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

    //*Formateo la fecha en formato DD/MM/YYYY o MM/DD/YYYY
    let newDate = new Date(this.currentValue).toLocaleDateString(this.toLocaleDateString)

    //* Emito el evento de change formControl con la fecha formateada
    this.onChange(newDate)

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
    return new CustomFieldErrorMatcher(this.control, this.errors)
  }

  readonly errorStateMatcher: ErrorStateMatcher = {
    isErrorState: (ctrl: FormControl) => (ctrl && ctrl.invalid)
  };

  /**///////////////////////////////////////////////////////////////////////////////  */

  validateAllFormFields(control: FormControl) {
    control.markAsTouched({ onlySelf: true });
  }
  /**
   * Función que filtra los días de del campo depositDate
   * @param {Date|null} date es el campo del formulario
   * @returns regresa "true" o "false"
   */
  dateFilter: (date: Date | null) => boolean | any = (date: Date | null) => {
    const day = date;
    switch (this.typeFilterDate) {
      case 0:
        return day! <= this.startDate;
      case 1:
        return day! <= this.startDate;
      case 2:
        return day! >= this.startDate;
      default:
        return;
    }
  };

  /**///////////////////////////////////////////////////////////////////////////////  */

  //? Formato de fecha en input

  /**
   * Setea el formato de fecha en es-ES
   */
  spanish() {
    this._locale = 'es-ES';
    this._adapter.setLocale(this._locale);
  }

  /**///////////////////////////////////////////////////////////////////////////////  */

  //? Lógica de manejo de fechas en rango

  createRangeDateGroup() {

    //* Obtengo acceso al formGroup padre que contiene a este input
    this.group = this.parentForm.form

    //*Creo el grupo que contendrá los formControl asociados
    this.rangeControlsGroup = new FormGroup({})

    //*Añado los controls del form padre al grupo con el que trabaja el input

    this.rangeControlsGroup.addControl(this.rangeControls[0], this.group.controls[this.rangeControls[0]])
    this.rangeControlsGroup.addControl(this.rangeControls[1], this.group.controls[this.rangeControls[1]])

    //*Si al menos la primera fecha es required, todo el grupo lo es
    if (this.group) {
      this.required = this.group.controls[this.rangeControls[0]].hasValidator(Validators.required)
    }

    //*Como ya el form padre está conectado, puedo escuchar sus cambios
    this.listenParentFormChanges()
  }

  /**
   * Escucha los cambios del formulario padre
   */
  listenParentFormChanges() {
    this.group.valueChanges.subscribe(value => {
      //*Cada vez que ocurra un cambio en el form padre, modifico a rangeControlsGroup, para que el input se vea actualizado

      //* Pongo las fechas solo si no vienen vacías, de lo contrario se generan fechas inválidas con Date()
      this.rangeControlsGroup.patchValue({
        [this.rangeControls[0]]: value[this.rangeControls[0]] ? this.checkDateFormat(value[this.rangeControls[0]]) : '',
        [this.rangeControls[1]]: value[this.rangeControls[1]] ? this.checkDateFormat(value[this.rangeControls[1]]) : ''
      })
    })
  }

  /**
   * Formatea la fecha que viene del formControl del form padre
   * @param date
   * @returns
   */
  checkDateFormat(date: string) {

    //* Si la fecha viene vacía no hago nada
    if(!date) {
      return
    }

    if (String(new Date(date)) == 'Invalid Date') {
      let [day, month, year] = date.split('/')
      const dateObj = new Date(+year, +month - 1, +day)
      return dateObj
    }

    //*Si la fecha viene en formato DD/MM/YYYY, asegurarme de colocar los días y meses en el espacio correcto a la hora de crear el objeto Date()
    if(this.toLocaleDateString == 'es-ES' && String(date).includes('/')) {
      let [day, month, year] = date.split('/')
      const dateObj = new Date(+year, +month - 1, +day)
      return dateObj
    }

    return new Date(date)
  }

  /**
   * Valida si el input tiene algún error de fecha
   * @param control FormControl que estoy evaluando
   * @returns
   */
  checkDateError(control: AbstractControl) {
    if (control.errors?.['matDatepickerFilter'] || control.errors?.['matStartDateInvalid'] || control.errors?.['matDatepickerParse']) {
      return true
    }
    return false
  }

  /**
   * Emite el cambio de fechas de rango
   * @param reset indica si se van a resetear las fechas
   */
  emitRangeDateChanges(reset?: boolean) {

    //* Cuando reset es true borro los valores del input y emito fechas vacías
    if (reset) {
      this.rangeControlsGroup.reset();
    }

    //* Transformo ambas fechas a un formato de tipo  DD/MM/YYYY o MM/DD/YYYY en el caso de que haya una fecha, sino se envía ''

    let startDate = this.rangeControlsGroup.controls[this.rangeControls[0]].value ? new Date(this.rangeControlsGroup.controls[this.rangeControls[0]].value).toLocaleDateString(this.toLocaleDateString) : ''

    let endDate = this.rangeControlsGroup.controls[this.rangeControls[1]].value ? new Date(this.rangeControlsGroup.controls[this.rangeControls[1]].value).toLocaleDateString(this.toLocaleDateString) : ''

    //*Modifico directamente el form padre con las nuevas fechas formateadas
    this.group.patchValue({
      [this.rangeControls[0]]: startDate,
      [this.rangeControls[1]]: endDate
    })

    //*Hago esto para que el form padre actualice su estatus de validación
    this.group.updateValueAndValidity({ onlySelf: true, emitEvent: false })

    this.inputChange.emit()
  }
}
