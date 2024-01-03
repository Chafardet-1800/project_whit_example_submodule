import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'cmm-cmp-t-main',
  templateUrl: './table-main.component.html',
  styleUrls: ['./table-main.component.scss'],
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
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})

export class CmmTableMainComponent implements OnInit, OnChanges {

  /**
   * Título de la tabla
   */
  @Input() tableTitle: string = ''

  /**
   * Indica si borraremos las fechas al momento de filtrar por Input de texto
   */
  @Input() deleteDatesOnInput: boolean = false

  /**
   * Esta variable va a tener el objeto de cada columna (header) de la tabla
   */
  @Input('header') columnsHeaderList: {
    text: string;
    field: string;
    action: boolean;
    cssClass: string;
  }[] = [];

  /**
   * Esta variable va a tener el objeto de cada row (fila) de la tabla
   */
  @Input('rows') rowListData: any;

  /**
   * Variable que indica si mi tabla incluye un detalle
   */
  @Input() isDetailTable: boolean = false;

  /**
   * Esta variable va a tener la cantidad de rows que se pueden utilizar
   */
  @Input() sizeOptions: number[] = [5, 10, 20];

  /**
   * Filtros de tables-filter TODO
   */
  @Input() filterFull: any;

  /**
   * PlaceHolder del input search estatico
   */
  @Input() placeholder: string = '';

  /**
   * Longitud  real de la lista  (count)
   */
  @Input() lengthList: any;

  /**
   * Variable que indica si muestro o no el paginado
   */
  @Input() showPaginator: boolean = true;

  /**
   * Variable que indica si muestro el input search o no
   */
  @Input() showSearch: boolean = true;

  /**
   * Variable que tiene el mensaje a mostrar en el caso del cover de que no hay datos
   */
  @Input() coverMessage: string = 'No hay datos disponibles';

  /**
   * Esta variable es el objeto de cada filtro que se quiera hacer, viene de cada componente que quiera tener filtros y llame a table-common
   */
  @Input() filtersObject: any;

  //? Lógica de botones de la tabla

  /**
   * Indica si mostramos el botón de descargar
   */
  @Input() showDownloadButton: boolean = false

  /**
   * Indica si mostramos el botón de añadir
   */
  @Input() showAddButton: boolean = false


  /**
   * Indica si mostramos el botón de refrescar
   */
  @Input() showRefreshButton: boolean = true

  /**
   * Texto para el botón de descarga
   */
  @Input() downloadButtonText: string = ''

  /**
   * Texto para el botón de añadir
   */
  @Input() addButtonText: string = 'Agregar'

  /**
   * Texto para el botón de refrescar
   */
  @Input() refreshButtonText: string = 'Refrescar'

  //? Lógica de emisión de acciones

  /**
   * Emite la señal del botón de descargar
   */
  @Output() downloadButton: EventEmitter<any> =  new EventEmitter();

  /**
   * Emite la señal de aplicar filtro
   */
  @Output() requesthttp: EventEmitter<any> = new EventEmitter();

  /**
   * Emite la señal de añadir
   */
  @Output() addButtonEmit: EventEmitter<any> = new EventEmitter()

  /**
   * Este evento emite un evento al componente donde se llame para enviar un objeto y que el objeto padre haga su propia peticion
   */
  @Output() emitActionDone: EventEmitter<any> = new EventEmitter();

  /**
   * Este evento emite un evento al componente donde se llame para vaciar los filtros
   */
  @Output() emitClearFilter: EventEmitter<null> = new EventEmitter();

  /**
   * Selector para manejar el sort de table
   */
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  /**
   * Variable que guarda el elemento de la columna con el fin de indicar si la fiald e detalle esta expandida o no
   */
  expandedElement: any;

  /**
   * Esta variable tiene el listado de todos los parametros que se van a pintar en la tabla Ej: idColor, nameColor, etc
   */
  public columnFieldsList: string[] | undefined;

  /**
   * Este formulario contiene todos los formcontrol que va a tener cada filtro en el html y venga de filtersObject
   */
  filtersForm!: FormGroup;

  /**
   * Este formulario contiene el formControl para cuando sea solo search estatico
   */
  filterdata!: FormGroup;

  /**
   * Este es el objeto que se va a mandar como request a cada componente con los filtros que el usuario se le apliquen desde la tabla
   */
  sendRequestObj: any;

  /**
   * Fecha
   */
  daterange!: Date;

  /**
   * Variable que indica si se muestran o no los filtros
   */
  hideFilters: boolean = false;

  /**
   * Paginado
   */
  pageSize: number = 0;
  pageIndex: number = 0;
  search: string = '';

  constructor(
    public matPaginatorIntl: MatPaginatorIntl,
    private fb: FormBuilder
  ) {
    this.matPaginatorIntl.itemsPerPageLabel = 'Elementos por página';
    this.matPaginatorIntl.firstPageLabel = 'Primera página';
    this.matPaginatorIntl.lastPageLabel = 'Última página';
    this.matPaginatorIntl.nextPageLabel = 'Siguiente página';
    this.matPaginatorIntl.previousPageLabel = 'Página anterior';
    this.matPaginatorIntl.getRangeLabel = function (page, pageSize, length) {
      if (length === 0 || pageSize === 0) {
        return '0 de ' + length;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;
      return startIndex + 1 + ' - ' + endIndex + ' de ' + length;
    };
  }

  //? Métodos de ciclo de vida

  ngOnInit(): void {
    // formulario dinamico con los filtros,
    // TO DO cada formcontrol debe tener su filterfull, es decir, debe existir ese parametro en el filterfull (reducer) para que tome ese valor
    // /TO DO el punto de arriba debe hacerse al momento de hacer el correcto filter en cada componente
    if (this.filtersObject) {
      let group = {};

      // Por cada objeto.form que venga de dates se crea un nuevo formcontrol
      if (this.filtersObject.inputs) {
        // Por cada objeto.form que venga de inputs.select o dates, se crea un nuevo formcontrol
        this.filtersObject.inputs.forEach((input_template: any) => {
          // inicio un arreglo donde voya aguardar las validaciones del input, si es que tiene
          let ValidatorsArray = [];

          // Si el input tiene un patron regex especifico
          if(input_template.regex){
            ValidatorsArray.push(Validators.pattern(input_template.regex))
          };
          // Si el input tiene un minimo de largo
          if(input_template.minLength){
            ValidatorsArray.push(Validators.minLength(input_template.minLength))
          };
          // Si el input tiene un maximo de largo
          if(input_template.maxLength){
            ValidatorsArray.push(Validators.maxLength(input_template.maxLength))
          };

          // Le asigno al arreglo de controles un nuevo paramtero con el nombre del control
          (group as any)[input_template.form] = new FormControl(
            // Le coloco el valor inicial que venga, si viene
            this.filterFull[input_template.form],
            // y la validaciones
            ValidatorsArray
          );

        });
      }

      // Por cada objeto.form que venga de dates se crea un nuevo formcontrol
      if (this.filtersObject.amounts) {
        // Por cada objeto.form que venga de amounts.select o dates, se crea un nuevo formcontrol
        this.filtersObject.amounts.forEach((input_template: any) => {
          // inicio un arreglo donde voya aguardar las validaciones del input, si es que tiene
          let ValidatorsArray = [];

          // Si el input tiene un minimo de largo
          if(input_template.min){
            ValidatorsArray.push(Validators.min(input_template.min))
          }
          // Si el input tiene un maximo de largo
          if(input_template.max){
            ValidatorsArray.push(Validators.max(input_template.max))
          }

          // Le asigno al arreglo de controles un nuevo paramtero con el nombre del control
          (group as any)[input_template.form] = new FormControl(
            // Le coloco el valor inicial que venga, si viene
            this.filterFull[input_template.form],
            // y la validaciones
            ValidatorsArray
          );
        });
      }

      // Por cada objeto.form que venga de dates se crea un nuevo formcontrol
      if (this.filtersObject.selects) {
        this.filtersObject.selects.forEach((input_template: any) => {
          (group as any)[input_template.form] = new FormControl(
            this.filterFull[input_template.form]
          );
        });
      }

      // Por cada objeto.form que venga de dates se crea un nuevo formcontrol
      if (this.filtersObject.dates) {
        this.filtersObject.dates.forEach((input_template: any) => {
          (group as any)[input_template.form] = new FormControl(
            this.filterFull[input_template.form]
          );
        });
      }

      // Por cada objeto.form que venga de rangeDates se crea un nuevo formcontrol
      if (this.filtersObject.rangeDates) {

        this.filtersObject.rangeDates.forEach((input_template: any) => {
          (group as any)[input_template.start] = new FormControl(
            this.filterFull[input_template.start]? new Date(this.filterFull[input_template.start]):''
          );

          (group as any)[input_template.end] = new FormControl(
            this.filterFull[input_template.end]? new Date(this.filterFull[input_template.end]):''
          );
        });
      }

      //* Inicializo el formulario
      this.filtersForm = new UntypedFormGroup(group);
    }

    //* Si hay un objeto de filtro, entonces seteo los parámetros principales para la tabla
    if (this.filterFull) {
      this.pageSize = this.filterFull.limit || '';
      this.pageIndex = this.filterFull.page || '';
      this.search = this.filterFull.search || '';
      this.filterdata = this.fb.group({
        search: [this.filterFull.search],
      });
    }

    //* Creo el máximo rango de fecha permitido (El día en el que estás leyendo esto OMG!!)
    this.daterange = new Date();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.columnFieldsList = this.columnsHeaderList!.map(
      (column: {
        text: string;
        field: string;
        action: boolean;
        cssClass: string;
      }) => column.field
    );

    this.rowListData = new MatTableDataSource<any[]>(this.rowListData);

    this.rowListData.sort = this.sort;

    this.pageSize = this.filterFull?.limit ?? 10;
    this.pageIndex = this.filterFull?.page ?? 0;
  }

  /**
   * Hace accesibles los controles del formulario
   */
  get fRequirements() {
    if (this.filtersForm) {
      return this.filtersForm?.controls as any;
    }
  }

  /**
   * Retorna si hay error en el campo del formcontrol
   */
  public hasError = (controlName: string, errorName: string) => {
    return this.fRequirements[controlName].hasError(errorName);
  };

  //? Lógica para obtener información de las columnas

  /**
   * Verifica si la columna tiene una acción
   * @param column
   * @returns
   */
  activateAction(column: string): boolean {

    return this.columnsHeaderList!.find((element) => element.field == column)!
      .action;
  }

  /**
   * Obtiene la clase asignada a esta columna
   * @param column
   * @returns
   */
  getClassColumn(column: string): string {
    return this.columnsHeaderList!.find((element) => element.field == column)!
      .cssClass;
  }

  /**
   * Obtiene el texto asociado a esta columna
   * @param column
   * @returns
   */
  getTextColumn(column: string): string {
    return this.columnsHeaderList!.find((element) => element.field == column)!
      .text;
  }

  //? Lógica de control de tabla

  /**
   * !No entiendo
   * @param element
   */
  expandElement(element: any) {

    this.expandedElement = this.expandedElement === element ? null : element;

    if(this.expandedElement) {
      this.emitActionDone.emit(element);
    }

  }

  /**
   * Recibe el evento del mat-paginator y lo envia a otra funcion para avisar al componente padre
   * @param event
   */
  paginationRequest(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.sendRequest();
  }

  /**
   * Funcion que emite el evento para hacer el request con filtros, los estaticos son limit page y los dinamicos estan el filtersForm
   */
  sendRequest(resetPage?: boolean, deleteDates?: boolean) {

    // Inicializo mi objeto que va a enviar con limit y page que siempre lo va a tener
    if(resetPage){
      this.sendRequestObj= {
        limit: 10,
        page: 0,
        search: this.filterdata.value.search,
      }
    }
    else {
      this.sendRequestObj= {
        limit: this.pageSize,
        page: this.pageIndex,
        search: this.filterdata.value.search,
      }
    }

    // Si viene filtersObject, (usando la tabla bien con los filtros bien, siempre va a venir)
    if (this.filtersObject) {
      if(!this.filtersForm?.valid) {
        return
      }

      //* Setea la fecha final igual a la inicial en caso de que no haya una fecha final
      if(this.filtersForm.controls['startDate']?.value &&
      !this.filtersForm.controls['endDate']?.value){
        this.filtersForm.controls['endDate'].patchValue(this.filtersForm.value.startDate)
      }

      // por cada filtro que se haya aplicado, se guarda su valor en el form, si existe su valor lo agrego al sendRequestObj
      Object.keys(this.filtersForm.controls).forEach((form) => {
        Object.assign(this.sendRequestObj, {
          [form]: this.filtersForm.value[form],
        });
      });
    }

    //*En caso de filtrar por input, borro las fechas
    if(deleteDates && this.deleteDatesOnInput){
      this.sendRequestObj.endDate = ''
      this.sendRequestObj.startDate = ''
      this.filtersForm.controls['startDate'].patchValue('')
      this.filtersForm.controls['endDate'].patchValue('')
    }

    // emito el evento al componente para que haga la peticion
    this.requesthttp.emit(this.sendRequestObj);
  }

  /**
   * Con esta funcion cada vez que escriba en el search, seteo el page en 0
   */
  setInitialPage() {
    if (!this.sendRequestObj) {
      this.sendRequestObj = {
        limit: this.pageSize || 10,
        page: this.pageIndex || 0,
        search: this.filterdata.value.search,
      };
    } else {
      this.pageIndex = 0;
      this.sendRequestObj.page = this.pageIndex || 0;
      this.sendRequestObj.search = this.filterdata.value.search;
    }
  }

  /**
   *  Recibe un evento de table action para luego emitirlo al componente list que lo requiera
   * @param event
   */
  reciveActionDone(event: any) {
    this.emitActionDone.emit(event);
  }

  /**
   * Esta funcion emite un evento para vaciar los filtros para luego emitirlo al componente que lo requiera
   */
  clearFilter() {
    this.filtersForm.reset()
    this.emitClearFilter.emit();
  }

  /**
   * Resetea los inputs de fecha
   */
  clearDate(FormControlNamestart: string, FormControlNameEnd?: string){

    //* Reseteo los inputs
    this.filtersForm.controls[FormControlNamestart].reset()
    if(FormControlNameEnd){
      this.filtersForm.controls[FormControlNameEnd].reset()
    }

    //* Envío el request del filtro actualizado
    this.sendRequest(true);
  }
}
