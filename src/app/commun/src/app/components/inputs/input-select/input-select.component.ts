import {
  Component,
  EventEmitter,
  HostListener,
  Injector,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, NgControl, Validators } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MAT_SELECT_CONFIG } from '@angular/material/select';
import { CmmSelectDialogModel } from '../../../data/dialogs/models/dialogs.model';
import { CmmCustomInput, CustomFieldErrorMatcher } from '../../../data/forms/models/input.models';
import { CmmErrorMessagesObject, CmmReplaceStringIndicator } from '../../../data/forms/models/inputs-messages';
import { CmmDialogService } from '../../../services/dialogs.service';
import { validOption } from '../../../validators/format.validator';

export type selectModes = 'autocomplete' | 'select' | 'dialog'

@Component({
  selector: 'cmm-cmp-i-select',
  templateUrl: './input-select.component.html',
  styleUrls: ['./input-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CmmInputSelectComponent),
      multi: true
    },
    {
      provide: NgControl,
      useValue: {},
    },
    {
      provide: MAT_SELECT_CONFIG,
      useValue: { overlayPanelClass: 'overlay_pane_cdk_margin' }
    }
  ]
})
export class CmmInputSelectComponent implements CmmCustomInput {

  /**
   * Variables que vienen del componente que recibe el error de la peticion para el serverMsg
   */
  @Input() error: any;

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
   * Variable minimo de longitud
   */
  @Input() minLength: number = 0;
  /**
   * Variable de máximo de longitud
   */
  @Input() maxLength: number = 80;

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
  @Input() required: boolean = false

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

  //? Lógica de select

  /**
   * Listado con las opciones
   */
  @Input() optionsList: any[] = []

  /**
   * Listado con las opciones filtradas
   */
  filteredList: any[] = []

  /**
   * Nombre de la propiedad a buscar por cada objeto del listado
   */
  @Input() optionKey: string = ''
  /**
   * Nombre de la propiedad a mostrar por cada objeto del listado
   */
  @Input() optionName: string = ''

  /**
   *  Indica si se evaluará el valor escrito al buscar en el input en modo de autocompletado
   */
  @Input() validateOnFilter: boolean = true

  /**
   * Indica si el input tiene permitido emitir cualquier valor escrito, ya sea que esté entre las opciones o no.
   */
  @Input() emitUnfilteredValues: boolean = true

  /**
   * Valor que sale al lado del valor principal de búsqueda
   */
  @Input() siblingOptionValue: string = ''

  /**
   * Indica si muestro el input con imágenes
   */
  @Input() displayImages: boolean = false

  /**
   * Ruta base de las imágenes (debe termina con '/')
   * @example imagesRoute="assets/img/covers/"
   */
  @Input() imagesRoute: string = ''

  /**
   * Nombre de la propiedad con el nombre de la imagen por cada objeto de la lista
   */
  @Input() imageSearchKey: string = ''

  /**
   * Dimensiones para la imagen a mostrar en el input
   */
  @Input() imgDimentions: { width: number, height: number } = { width: 30, height: 30 }

  /**
   * Indica el modo de input (Si es de completado o solo select)
   */
  @Input() selectMode: selectModes = 'select'

  /**
   * Indica si se muestra el botón de eliminar selección
   */
  @Input() displayClearSelect: boolean = true

  /**
   * Mensaje de reemplazo en el mensaje de error de tipo pattern
   */
  @Input() replaceMessage = ''

  /**
   * Ruta de la imagen escogida
   */
  choosenImageRoute: string = ''

  /**
   * Valor seleccionado
   */
  valueSelected: string = ''

  /**
   * Valor seleccionado a enviar al form
   */
  choosenSearchKeyValue: string = ''

  /**
   * Creo un selector para el elemento MatAutocomplete
   */
  @ViewChild(MatAutocomplete) myMatAutocomplete!: MatAutocomplete;

  /**
   * Escucha el evento de presionar tecla
   * @param event
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.choosenSearchKeyValue && event.code != 'Backspace' && this.validateOnFilter) {
      event.preventDefault()
    }
  }

  constructor(
    public injector: Injector,
    public dialog: MatDialog,
    public dialogService: CmmDialogService
  ) { }

  //? Métodos de ciclo de vida

  ngOnInit(): void {

    //* Reemplazo los mensajes de error
    this.replaceErrorMessages()
  }

  ngOnChanges(changes: SimpleChanges): void {

    //? Lógica nueva

    if (changes['optionsList'] && this.optionsList.length) {
      //*Agrego el validator solo cuando ya tenga cargado el listado
      this.filteredList = this.optionsList

      //* Agrego la validación de autocompletado apenas exista la lista de validación
      this.addFilterValidator()

      //* En caso de que cambie la lista vuelvo a reaplicar el valor inicial si es que viene
      if (this.currentValue) {
        this.filterInitialValue()
      }
    }
  }

  ngAfterViewInit(): void {
    const ngControl: NgControl = this.injector.get(NgControl);
    if (ngControl) {
      setTimeout(() => {
        this.control = ngControl.control as FormControl;
        if (this.control && this.optionsList.length) {
          this.addFilterValidator()
        }
        this.required = this.control?.hasValidator(Validators.required)
      })
    }
  }

  ngOnDestroy(): void {}

  /**///////////////////////////////////////////////////////////////////////////////  */



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

    //* Si hay valor inicial, entonces seteo la opción en el input
    if (this.currentValue) {
      this.filterInitialValue()
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

  /**
   * Modifica los mensajes de error si hace falta
   */
  replaceErrorMessages() {
    //* Reemplazo el nombre del tipo de texto en el que se evalúa el patrón
    this.CmmErrorMessagesObject.incorrectPattern = this.CmmErrorMessagesObject.incorrectPattern.replace(
      this.CmmReplaceStringIndicator,
      this.replaceMessage
    )
  }

  /**
   * Agrega el validator de filtro en autocompletado
   */
  addFilterValidator() {
    //*Agrego la validación si el input será evaluado en modo de autocompletado
    if (this.validateOnFilter && this.optionsList.length) {
      this.control?.addValidators(validOption(this.optionsList, this.optionKey))
      this.control?.updateValueAndValidity()
    }
  }

  /**
   * Le envía al formControl el nuevo valor del input
   * @param emitUnfilteredValues Indica si se emitirá el valor escrito o el valor que corresponda a la búsqueda del filtro
   */
  emitValue(emitUnfilteredValues?: boolean) {
    //* Genero el evento de touched
    this.onTouch()

    //* Genero el evento de change para el formControl y emito el valor correspondiente dependiendo del tipo de emisión permitida
    this.onChange(emitUnfilteredValues ? this.currentValue : this.choosenSearchKeyValue)

    //* Emito el evento de cambio de valor
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

  readonly errorStateMatcher: ErrorStateMatcher = {
    isErrorState: (ctrl: FormControl) => (ctrl && ctrl.invalid)
  };

  /**///////////////////////////////////////////////////////////////////////////////  */

  //? Lógica de manejo de imágenes

  /**
   * Hace un filtrado y obtiene la correspondiente al valor seleccionado
   * @param value
   */
  getFinalImage(value: string) {

    //* Elimino la ruta anterior
    this.choosenImageRoute = ''

    //* Obtengo el objeto correspondiente al valor escogido dentro del listado de opciones
    let filtered = this.optionsList.filter(option => option[this.optionKey] == value)[0]

    //* Verifico que exista un objeto correspondiente al valor escogido
    if (filtered) {

      //* Obtengo el nombre de la imagen dentro del objeto: filtered
      let imageValue = filtered[this.imageSearchKey]

      //* Creo la ruta completa para mostrar la imagen, con la ruta base y el nombre de la imagen (Solo funciona con imágenes SVG)
      this.choosenImageRoute = this.imagesRoute + imageValue.toLowerCase() + '.svg'

    }

  }

  /**///////////////////////////////////////////////////////////////////////////////  */

  //? Lógica de diálogo de selección

  /**
   * Recibe el evento de selección
   * @param value
   */
  selectValue(selected: any) {

    //* Si la selección no se hizo directamente por el usuario, no ejecuto nada (Esto previene una doble emision del evento, que puede traer valores erróneos)
    if(!selected.isUserInput) {
      return
    }

    //* Obtengo el valor correspondiente al valor escogido
    this.choosenSearchKeyValue = this.optionsList.filter(option => option[this.optionName] == selected.source.value)[0][this.optionKey]

    //* Si debo mostrar imágenes obtengo la imagen escogida
    if (this.displayImages) {
      this.getFinalImage(this.choosenSearchKeyValue)
    }

    //* Emito el valor
    this.emitValue()
  }

  /**
   * Recibe el evento de selección en autocomplete
   * @param value
   */
  selectAutocomplete(selected: any) {

    //* Obtengo el valor correspondiente al valor escogido
    this.choosenSearchKeyValue = this.optionsList.filter(option => option[this.optionName] == selected.option.value)[0][this.optionKey]

    //* Si debo mostrar imágenes obtengo la imagen escogida
    if (this.displayImages) {
      this.getFinalImage(this.choosenSearchKeyValue)
    }

    //* Emito el valor
    this.emitValue()
  }

  /**
   * Se encarga de setear todos los valores en caso de que haya un valor preseleccionado
   */
  setInitialValue() {
    //* Seteo el valor escogido de acuerdo al valor que ya tenía el formControl
    this.choosenSearchKeyValue = this.optionsList.filter(option => option[this.optionName] == this.currentValue)[0][this.optionKey]

    //* Si debo mostrar imágenes obtengo la imagen escogida
    if (this.displayImages) {
      this.getFinalImage(this.choosenSearchKeyValue)
    }

    //* Comentado porque si el valor está preseleccionado, entonces no hay necesidad de reenviarle el mismo valor al formControl
    // this.emitValue()
  }

  /**
   * Filtra el listado para setear el valor inicial
   */
  filterInitialValue() {

    //*No puedo aplicar esta lógica si no hay listado
    if (!this.optionsList.length) {
      return
    }

    //* Aplico una estrategia de selección distinta para cada modo de selección
    switch (this.selectMode) {

      case 'select':

        this.valueSelected = this.optionsList.filter(option => option[this.optionKey] == this.currentValue)[0][this.optionName]
        break;

      case 'autocomplete':
      case 'dialog':

        //* Consigo un valor dentro de la lista que coincida con el valor ya seteado en el formControl y obtengo su valor para mostrar
        this.valueSelected = this.optionsList.filter(option => option[this.optionKey] == this.currentValue)[0]?.[this.optionName]

        //* Ahora el valor que muestra el input es igual al valor que se debe mostrar
        this.currentValue = this.valueSelected ?? this.currentValue;

        //* Verifico que se haya encontrado algún valor preseleccionado en el formControl
        if(this.currentValue) {

          //*De esta forma emito el valor seleccionado inicialmente
          this.setInitialValue()

        }

        break;

      default:
        break;
    }
  }

  /**
   * Filtra el valor escrito
   * @param event
   */
  filterValue() {
    let valueLength = this.currentValue.length

    //*Borro estos valores porque la selección debe cambiar cada vez que escriba
    this.choosenImageRoute = ''
    this.choosenSearchKeyValue = ''

    //* Filtro las opciones de acuerdo al valor que está escrito
    this.filteredList = this.optionsList.filter(option => (option[this.optionName].substring(0, valueLength)).toLowerCase() == this.currentValue.toLowerCase())

    //* Si la búsqueda coincide 100% con una de las opciones, entonces lleno la variable
    if (this.filteredList.length == 1 && this.filteredList[0][this.optionName].toLowerCase() == this.currentValue.toLowerCase()) {

      //* Creo una nueva lista de selección que contenga la única opción filtrada
      const selMatOption = this.myMatAutocomplete.options.toArray().find(option => option.value.toLowerCase() == this.currentValue.toLowerCase())

      //* Selecciono esa única opción
      selMatOption?.select();

      //* Reseteo las opciones filtradas para tener todas las opciones disponibles otra vez
      this.filteredList = []

      //* Si tengo permitido emitir valores sin filtrar, entonces emito de una vez
    } else if (this.emitUnfilteredValues) {
      this.emitValue(true)
    }
  }

  /**
   * Elimina la opción seleccionada
   */
  clearSelected() {
    this.filteredList = this.optionsList
    this.currentValue = ''
    this.choosenSearchKeyValue = ''
    this.choosenImageRoute = ''
    this.emitValue()
  }

  /**
   * Abre el diálogo para escoger opciones del input
   */
  openSelectDialog() {

    //* Data para el diálogo de selección con todas las opciones
    let data: CmmSelectDialogModel = {
      title: this.label,
      label: this.label,
      placehoder: 'Ej: BS',
      optionsList: this.optionsList,
      optionValue: this.optionName,
      searchKey: this.optionKey,
      displayImages: this.displayImages,
      imagesRoute: this.imagesRoute,
      imageSearchKey: this.imageSearchKey,
      imgDimentions: this.imgDimentions,
      siblingOptionValue: this.siblingOptionValue,
    }

    //* No veo recomendable cerrar todos los diálogos, porque puede ocasionar errores extraños
    // this.dialogService.CmmCloseAllDialogs()

    //* Abro el diálogo de selección
    this.dialogService.CmmOpenSelectionDialog(data).subscribe(response => {
      if (response) {

        //* Filtro para setear en el input el valor escogido del diálogo
        this.valueSelected = response
        this.choosenSearchKeyValue = this.optionsList.filter(option => option[this.optionName] == this.valueSelected)[0][this.optionKey]

        //*Selecciono una imagen si se debe mostrar
        if (this.displayImages) {
          this.getFinalImage(this.choosenSearchKeyValue)
        }

        //* Emito el valor seleccionado
        this.emitValue()
      }
    })
  }
}
