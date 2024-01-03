import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CmmTableHeader, CmmStatusTypeGroupsModel, CmmComponentTableModel, CmmTableRow } from 'src/app/common/src/app/data/tables/models/tables.model';
import { setSpinner } from 'src/app/common/src/app/data/utils/reducer/utils.actions';
import { CmmDataService } from 'src/app/common/src/app/services/data.service';
import { CmmDialogService } from 'src/app/common/src/app/services/dialogs.service';
import { clearDepositFilter, setDepositFilter } from 'src/app/core/reducer/module.actions';
import { DepositFilterModel } from 'src/app/core/reducer/module.models';
import { initialDepositFilter } from 'src/app/core/reducer/module.reducers';
import { depositFilter } from 'src/app/core/reducer/module.selectors';
import { DepositsModel } from '../../models/deposits.model';
import { DepositService } from '../../services/deposit.service';
import { CmmAlertToastrModel } from 'src/app/common/src/app/data/dialogs/models/dialogs.model';
import { CmmUtilsService } from 'src/app/common/src/app/services/utils.service';

@Component({
  selector: 'pag-test-list',
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.scss']
})
export class TestListComponent implements CmmComponentTableModel {
  //? Lógica de lifecicle

  /**
   * Desactiva la subscripción de observables
   */
  $unsubscribe = new Subject<void>();

  //? Variables de la tabla

  /**
   * Encabezados de la tabla
   */
  header: CmmTableHeader[] = [
    {
      text: 'ID',
      field: 'idDeposit',
      action: false,
      cssClass: '',
    },
    {
      text: 'Usuario',
      field: 'depositTargetUserName',
      action: false,
      cssClass: '',
    },
    {
      text: 'Correo',
      field: 'depositTargetUserEmail',
      action: false,
      cssClass: 'd-none d-md-table-cell',
    },
    {
      text: 'Nombres',
      field: 'depositTargetPersonName',
      action: false,
      cssClass: 'd-none d-md-table-cell',
    },
    {
      text: 'Banco',
      field: 'depositTargetBankName',
      action: false,
      cssClass: 'd-none d-md-table-cell',
    },
    {
      text: 'Monto',
      field: 'depositAmount',
      action: false,
      cssClass: '',
    },
    {
      text: 'Estatus',
      field: 'depositStatusName',
      action: false,
      cssClass: 'd-none d-md-table-cell',
    },
    {
      text: 'Fecha',
      field: 'depositDate',
      action: false,
      cssClass: 'd-none d-md-table-cell',
    },
    {
      text: 'Detalle',
      field: 'action',
      action: true,
      cssClass: 'px-3',
    },
  ];

  /**
   * Array de filas de la tabla
   */
  rows: CmmTableRow[] = [];

  /**
   * Cantidad de filas de la tabla
   */
  lengthList: number = 0;

  /**
   * Objeto con los filtros de la tabla
   */
  filterFull: DepositFilterModel = initialDepositFilter;

  /**
   * Listados para los filtros
   */
  depositCurrency: {
    currencyId: number,
    currencyName: string
  }[] = [
    { currencyId: 0, currencyName: 'Todas' }
  ];
  depositStatus: {
    value: number,
    text: string
  }[] = [
    { value: 0, text: 'Todos' },
    { value: 9, text: 'Confirmada' },
    { value: 8, text: 'Por confirmar' },
    { value: 28, text: 'Rechazado' },
  ];

  /**
   * Objeto para crear los inputs de filtros que tendra la tabla
   */
  filtersObject = {
    // inputs: un input search normalito
    inputs: [
      {
        form: 'search',
        placeholder: 'Buscar por usuario o correo',
        label: 'Buscar',
      },
    ],

    // date: inputs fecha
    rangeDates: [
      {
        start: 'startDate',
        end: 'endDate',
        placeholder: '',
        label: 'Fechas relevantes',
      },
    ],

    // selects: llevan una lista, un value que es el id como tal que se va a enviar, y un name que es el valor que se muestra (id,name)
    selects: [
      {
        form: 'idDepositCurrency',
        value: 'currencyId',
        name: 'currencyName',
        label: 'Moneda',
        placeholder: 'Ej: Bs',
        list: this.depositCurrency,
      },
      {
        form: 'idDepositStatus',
        value: 'value',
        name: 'text',
        label: 'Estatus del depósito',
        placeholder: 'Ej: Confirmada',
        list: this.depositStatus,
      },
    ],

    // amounts: un input amount con separador de miles
    amounts: [
      {
        form: 'amountStart',
        placeholder: 'Ej: 100.000',
        label: 'Monto inicio',
      },
      {
        form: 'amountEnd',
        placeholder: 'Ej: 100.000',
        label: 'Monto fin',
      },
    ],
  };

  /**
   * Observable de suscripción al store con los filtros de la tabla
   */
  $filter!: Observable<DepositFilterModel>;

  /**
   * Objeto para crear grupos de estatus asociados a un tipo de color
   */
  statusDictionary: CmmStatusTypeGroupsModel[] = [];

  //?Variables fechas para no usar la utc en la peticion

  /**
   * Filtro de fecha inicial de tabla
   */
  startDate: string = '';

  /**
   * Filtro de fecha final de tabla
   */
  endDate: string = '';

  //? Lógica de privilegeios

  /**
   * Listado de acciones que existen en el módulo
   */
  actionKeys: string[] = [];

  /**
   * Dentro de cada constructor se suscriben los observables:
   */
  constructor(
    public dialogService: CmmDialogService,
    public dataService: CmmDataService,
    public depositService: DepositService,
    public utilsService: CmmUtilsService,
    private store: Store,
    private router: Router
    ) {

      // Solicitamos el estado actual del filtro en el reducer
      this.$filter = this.store.pipe(select(depositFilter));
      this.$filter.pipe(takeUntil(this.$unsubscribe)).subscribe({
        next: (data: any) => {

          // Guardamos el estado obtenido en la variable indicada
          this.filterFull = data;

        },
      });

    }

  ngOnInit(): void{

    // Ejecutamos la funcion para obtener el listado de monedas
    this.getCurrenciesList();

    // Ejecutamos la funcion para obtener los datos de la tabla
    this.getTableData();

  }

  //? Métodos para obtener información para construir tabla

  /**
   * Obtiene la información necesaria para construir la tabla, aplicando los filtros de
   */
  getTableData(): void{

    // Activamos el spinner en common
    this.store.dispatch(new setSpinner(true));

    // Convierto los montos en formato backend
    let amountStart =
      this.filterFull.amountStart
      ? this.dataService.CmmAmountBackendFormat(this.filterFull.amountStart)
      : this.filterFull.amountStart;
    let amountEnd =
      this.filterFull.amountEnd
        ? this.dataService.CmmAmountBackendFormat(this.filterFull.amountEnd)
        : this.filterFull.amountEnd;

    // Llamo al servicio
    this.depositService
      .getDepositsList(
        this.filterFull.limit,
        this.filterFull.search,
        this.filterFull.page,
        this.startDate,
        this.endDate,
        amountStart,
        amountEnd,
        this.filterFull.idDepositStatus,
        this.filterFull.idDepositCurrency
      )
      .pipe(
        // Indicamos que esta funcion se ejecutara hasta que el indique lo contario
        takeUntil(this.$unsubscribe)
      )
      .subscribe({
        next: (response) => {

          // Desactivamos el spinner en common
          this.store.dispatch(new setSpinner(false));

          // Accedemos data de la respuesta
          response = (response as any).data;

          // Guardamos la cantidad de elementos indicados
          this.lengthList = (response as any).count;

          // Accedemos a la informacion de las filas suministrada y la guardamos en la variable indicada
          response = (response as any).rows;

          // Ejecutamos la funcion para arreglar la data suministrada para utilizarla en la tabla
          this.buildTable(response);

        },
        error: (error) => (

          // Desactivamos el spinner en common
          this.store.dispatch(new setSpinner(false))

        ),
      });

  }

  /**
  * Genera las filas de la tabla
  * Se llama dentro de getTableData
  * El modelo de tableRows es igual a lo que viene en la petición de getTableData
  */
  buildTable(tableRows: any[]): void{

    // Guardamos la informacion suministrada con el formato indicado
    let depositResponse: DepositsModel[] = tableRows;

    // Creamos un arreglo donde se guardaran todas las filas segun se armen
    let AllTransRow: any[] = [];

    // Itero sobre mi lista y voy armando mi objeto fila
    for (let index = 0; index < depositResponse.length; index++) {

      // Guardo el elemento indicado del listado de informacion suministrada
      const element: DepositsModel = depositResponse[index];

      // Guardamor la informacion en el formato correcto para mostrarlo en la tabla
      let QZ = {
        idDeposit: element.idDeposit,
        depositStatusName: element.depositStatusName,
        depositAmount:
          this.dataService.CmmAmountUserFormat(
            element.depositAmount,
            element.depositCurrencyName
          ) +
          ' ' +
          element.depositCurrencyName,

        depositDate: element.depositDate,
        depositTargetBankName: element.depositTargetBankName,
        depositTargetUserName: element.depositTargetUserName,
        depositTargetUserEmail: element.depositTargetUserEmail,
        depositTargetPersonName:
          element.depositTargetPersonName +
          ' ' +
          element.depositTargetPersonSurname,
        action: {
          nameAction: 'iconFunctionAction',
          value: {
            idDeposit: element.idDeposit,
          },
          icon: 'launch',
          class: 'cursor-pointer',
          function: 'goDepositDetail',
          tooltip: 'Ver detalle',
        },
      };

      // Meto todos mis objetos en la lista AllTransRow y voy haciendo push de cada uno
      AllTransRow.push(QZ);

    };

    // Guardamos el arreglo con la informacion correctamente formateada
    this.rows = [...AllTransRow];


    // Desactivamos el spinner en common
    this.store.dispatch(new setSpinner(false));

  }

  //? Métodos para obtener información extra para la tabla

  /**
   * Funcion que setea fechas iniciales startDate y endDate con diferencia de un mes
   */
  setDate() {

    // Se Selecciona la fecha de un mes antes del dia de hoy
    let newDate: any = new Date(new Date().getFullYear(),new Date().getMonth()+1,new Date().getDate());

    // Indicamos la fecha inicio, hoy +1 mes
    this.startDate = this.dataService.cmmFormatDate(newDate);

    // Indicamos la fecha fin, hoy
    this.endDate = this.dataService.cmmFormatDate(new Date().toString());

  }

  /**
   * Funcion que llama al servicio para obtener las monedas
   */
  getCurrenciesList() {

    // Hacemos la peticion a la api
    this.utilsService.CmmGetCurrenciesList()
      .pipe(
        // Indicamos que esta funcion se ejecutara hasta que el indique lo contario
        takeUntil(this.$unsubscribe)
      )
      .subscribe({
        next: (res) => {

          // Accedemos a la data de la respuesta
          const response = (res as any).data;

          // Iteramos por cada elemento que venga en la respuesta
          response.forEach((element: any) => {

            // Agregamos un objeto con el id y el nombre de cada moneda que venga
            this.depositCurrency.push({
              currencyId: element.idCurrency,
              currencyName: element.nameCurrency,
            });

          });
        },
        error: (err) => {},
      });

  }

  //? Lógica de manejo de información de la tabla

  /**
   * Recibe el filtro actualizado y ejecuta todas las transformaciones para pasarselo a getTableData.
   */
  requetshttp(requestObj:any): void{

    // Si Este filtro requeire un input de fecha de inicio
    if (requestObj.startDate) {

      // Acomodo las fechas al formato que pide backend
      this.startDate = this.dataService.cmmFormatDate(requestObj.startDate);

    }

    // Si Este filtro requeire un input de fecha de fin
    if (requestObj.endDate) {

      // Acomodo las fechas al formato que pide backend
      this.endDate = this.dataService.cmmFormatDate(requestObj.endDate);

    }

    // En caso de que haya una fecha de inicio y de fin
    if (requestObj.startDate && requestObj.endDate) {

      // Si la fecha de inicio es mayor que la fecha de fin
      if (requestObj.startDate > requestObj.endDate) {

        // Armamos la data de la alerta
        const messagesData: CmmAlertToastrModel = {
          typeIcon: 'error',
          text: 'Formato de fecha inválido.',
        }

        // Abrimos la alerta con el mensaje de error
        this.dialogService.CmmAlertToastr(messagesData);

        return;

      };

    };

    // Vaciamos el arreglo de informacion que se muestra en la tabla
    this.rows = [];

    // Actualizamos el estado del filtro en el reducer
    this.store.dispatch(
      new setDepositFilter({
        deposit: requestObj,
      })
    );

    // Volvemos a solicitar la informacion para que se apliquen los filtros
    this.getTableData();

  }

  /**
   * @param elementReceived Con esta funcion voy a recibir el objeto del row clickeado y lo redirige a la funcion que corresponde
   */
  routerFunction(elementReceived: any): void{

    // En caso de que la accion realizada corresponda con ir al detalle
    if(elementReceived.function == 'goDepositDetail') {

      // Ejecutamos la funcion correspondiente
      this.goDepositDetail(elementReceived.value);

    };

  }

  /**
   * Funcion que redirige al usuario a la vista de detalle del deposito que seleccione
   */
  goDepositDetail(data: any) {

    // Llevamos al usurio al detalle del deposito indicado
    this.router.navigate([`deposits/detail/${data.idDeposit}`]);

  }

  /**
   * Limpia el filtro de la tabla y vuelve a llamar getTableData
   */
  clearFilter(): void{

    // Reiniciamos el estado del filtro utilizado
    this.store.dispatch(new clearDepositFilter());

    // Reiniciamos el valor de la fecha de inicio
    this.startDate = '';

    // Reiniciamos el valor de la fecha de fin
    this.endDate = '';

    // Volvemos a solicitar la informacion para que se apliquen los filtros
    this.getTableData();

  }

  ngOnDestroy(): void{

    // Ejecutamos la funcion para limpiar los datos del filtro
    this.clearFilter();

    // terminamos cualquier proceso que estuviera pendiente
    this.$unsubscribe.next();
    this.$unsubscribe.complete();

  }
}
