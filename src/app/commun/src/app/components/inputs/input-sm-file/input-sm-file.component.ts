import {
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
  forwardRef
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, NgControl, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { documentImages } from '../../../../assets/images/images-routes';
import { CmmCustomInput, CustomFieldErrorMatcher, imgFileTypes } from '../../../data/forms/models/input.models';
import { CmmErrorMessagesObject, CmmReplaceStringIndicator } from '../../../data/forms/models/inputs-messages';

@Component({
  selector: 'cmm-cmp-i-smfile',
  templateUrl: './input-sm-file.component.html',
  styleUrls: ['./input-sm-file.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CmmInputSmFileComponent),
      multi: true
    },
    {
      provide: NgControl,
      useValue: {},
    }
  ]
})
export class CmmInputSmFileComponent implements CmmCustomInput {

  //? Lógica nueva de input-file

  /**
   * Archivo del input
   */
  file: any

  /**
   * Nombre del archivo
   */
  fileName: string = ''

  /**
   * Imagen del archivo del input
   */
  fileImageUrl: string = ''

  /**
   * Tamaño del archivo seleccionado
   */
  fileSize: string = ''

  /**
   * Indica si se muestra el tamaño del archivo seleccionado
   */
  displayFileSize: boolean = true

  /**
   * Tamaño máximo permitido en el input
   */
  @Input() maxFileSize: number | string = 12

  /**
   * Array de tipos de archivos que soporta el input
   */
  imgFileTypes: string[] = imgFileTypes


  /**
   * Mensaje con el que reemplazo el CmmReplaceStringIndicator
   */
  replacingErrorMessage: string = ''

  //? Lógica de controlValueAccessor
  /**
   * Variable que indica si se puede o ingresar valores en el input
   */
  @Input() readOnly: boolean = false;

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
   * Objeto con todos los mensajes de error base
   */
  CmmErrorMessagesObject = { ...CmmErrorMessagesObject };

  /**
   * String para indicar qué parte del mensaje de error será reemplazada
   */
  CmmReplaceStringIndicator = CmmReplaceStringIndicator;

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

  }

  ngOnChanges(changes: SimpleChanges): void { }

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

    //* Si no hay archivo en el form, lo elimino del input
    if(!obj) {
      this.removeFile()
    }
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

  //? Lógica de manejo de archivo

  @ViewChild('fileInput') inputFile!: ElementRef<HTMLElement>

  /**
   * setea el archivo y obtiene toda la información de este
   * @param event
   */
  setFile(event: Event | any) {
    this.file = event.target.files[0];
    if (this.file) {
      let extension = this.file.type.split('/')[1];
      this.fileName = this.file.name
      let reader = new FileReader();
      reader.readAsDataURL(this.file as Blob)

      reader.onload = () => {
        if (!this.imgFileTypes.includes(extension)) {
          this.fileImageUrl = documentImages.document_od_svg
        } else {
          this.fileImageUrl = reader.result as string
        }
      }

      this.getFileSize()
      this.emitValue(this.file)
    }
  }

  /**
   * Resetea el input de archivo cada vez que es clickeado
   * @param event
   */
  resetInputFiles(event: Event | any) {
    event.target.value = ''
  }

  /**
   * Elimina el archivo del input
   */
  removeFile() {
    //*Reinicio todas las variables del archivo
    this.file = null
    this.currentValue = ''
    this.fileName = ''
    this.fileSize = ''
    this.fileImageUrl = ''
    //*Envía al formControl el nuevo valor del input
    this.emitValue(this.file)
  }

  /**
   * Obtiene el tamaño del archivo y modifica el mensaje de error
   */
  getFileSize() {


    //* Lógica para obtener el peso del archivo en diferentes formatos
    //* El tamaño siempre viene en bytes
    if (String(this.file.size).length > 6) {
      this.fileSize = '(' + String(parseInt(String(this.file.size / 1024 / 1024))) + ' MB)'
    } else if (String(this.file.size).length < 4) {
      this.fileSize = '(' + String(parseInt(String(this.file.size))) + ' b)'
    } else {
      this.fileSize = '(' + String(parseInt(String(this.file.size / 1024))) + ' kb)'
    }

    //* Actualizo los mensajes de error
    this.replaceErrorMessages()

  }

  /**///////////////////////////////////////////////////////////////////////////////  */

  /**
  * Le envía al formControl el nuevo valor del input
  */
  emitValue(file?: any) {
    //* Emito el evento de touch formControl
    this.onTouch()

    //* Emito el evento de change formControl
    this.onChange(file)

    //* Emito evento de cambio de valor
    this.inputChange.emit()
  }

  /**///////////////////////////////////////////////////////////////////////////////  */

  //? Lógica de manejo de errores

  /**
   * Se encarga de personalizar los mensajes de error del input
   */
  replaceErrorMessages() {

    //* En caso de haber un tamaño en el mensaje de error, lo elimino
    if (this.replacingErrorMessage) {

      //* Reemplazo el nombre del tipo de texto en el que se evalúa el patrón
      this.CmmErrorMessagesObject.maxFileSize = this.CmmErrorMessagesObject.maxFileSize.replace(
        this.replacingErrorMessage,
        this.CmmReplaceStringIndicator
      )

    }

    //* Nuevo mensaje de error con el tamaño de archivo
    this.replacingErrorMessage = String(this.maxFileSize) + ' MB'

    //* Reemplazo el nombre del tipo de texto en el que se evalúa el patrón
    this.CmmErrorMessagesObject.maxFileSize = this.CmmErrorMessagesObject.maxFileSize.replace(
      this.CmmReplaceStringIndicator,
      this.replacingErrorMessage
    )
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

}
