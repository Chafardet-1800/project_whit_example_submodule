import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CmmComponentTableModel, CmmTableColumnErrorMsg, CmmTableHeader, CmmTableRow, CmmStatusTypeGroupsModel } from 'src/app/common/data/tables/models/tables.model';
import { setSpinner } from 'src/app/common/data/utils/reducer/utils.actions';
import { CmmDataService } from 'src/app/common/services/data.service';
import { CmmDialogService } from 'src/app/common/services/dialogs.service';
import { clearWithdrawFilter, setWithdrawFilter } from 'src/app/core/reducer/module.actions';
import { WithdrawFilterModel } from 'src/app/core/reducer/module.models';
import { withdrawFilter } from 'src/app/core/reducer/module.selectors';
import { WidthdrawModel } from '../../models/users.model';
import { UsersService } from '../../services/users.service';
import { CmmAlertToastrModel } from 'src/app/common/data/dialogs/models/dialogs.model';

@Component({
  selector: 'cmp-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements CmmComponentTableModel{

  //? Lógica de lifecicle
  /**
   * Desactiva la subscripción de observables
   */
  $unsubscribe: Subject<void> =  new Subject();

  //? Variables de la tabla

  /**
   * Nombre Columnas de la tabla
   */
  public header: CmmTableHeader[] = [
    {
      text: 'ID',
      field: 'idWithdraw',
      action: false,
      cssClass: 'text-nowrap',
    },
    {
      text: 'Usuario',
      field: 'withdrawUserName',
      action: false,
      cssClass: '',
    },
    {
      text: 'Correo',
      field: 'withdrawUserEmail',
      action: false,
      cssClass: 'd-none d-md-table-cell',
    },
    {
      text: 'Nombres',
      field: 'withdrawPersonName',
      action: false,
      cssClass: 'd-none d-md-table-cell',
    },
    {
      text: 'Banco',
      field: 'withdrawTargetBank',
      action: false,
      cssClass: 'd-none d-md-table-cell',
    },

    {
      text: 'Monto',
      field: 'withdrawAmount',
      action: false,
      cssClass: '',
    },
    {
      text: 'Estatus',
      field: 'withdrawStatusName',
      action: false,
      cssClass: 'd-none d-md-table-cell',
    },
    {
      text: 'Fecha',
      field: 'withdrawCreatedDate',
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
   * Cantidad de páginas de la tabla
   */
  lengthList: number = 0;

  /**
   * Objeto con los filtros de la tabla
   */
  filterFull: any;

  /**
   * Listados de tipos de monedas
   */
  withdrawCurrency = [{ currencyId: 0, currencyName: 'Todas' }];

  /**
   * Tipos de estadus de retiro
   */
  withdrawStatus = [
    { value: 0, text: 'Todos' },
    { value: 9, text: 'Confirmada' },
    { value: 8, text: 'Por confirmar' },
    { value: 28, text: 'Rechazado' },
  ];

  /**
   * Esta variable tendra todos los filtros que sean necesarios en table-filter
   */
  filtersObject = {

    // inputs: un input search normalito
    inputs: [
      {
        form: 'search',
        placeholder: 'Buscar por usuario, correo o banco',
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
        form: 'idWithdrawCurrency',
        value: 'currencyId',
        name: 'currencyName',
        label: 'Moneda',
        placeholder: 'Ej: Bs',
        list: this.withdrawCurrency,
      },
      {
        form: 'idWithdrawStatus',
        value: 'value',
        name: 'text',
        label: 'Estatus del retiro',
        placeholder: 'Ej: Confirmada',
        list: this.withdrawStatus,
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
  $filter!: Observable<WithdrawFilterModel>;

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

  //? Lógica de privilegios

  /**
   * Listado de acciones que existen en el módulo
   */
  actionKeys: string[] = [];

  constructor(
    private usersService: UsersService,
    private dataService: CmmDataService,
    private dialogService: CmmDialogService,
    private store: Store
  ) {

    // Solicitamos el estado actual del filtro en el reducer
    this.$filter = store.select(withdrawFilter)
    this.$filter.pipe(takeUntil(this.$unsubscribe)).subscribe({
      next: (data: WithdrawFilterModel) => {

        // Guardamos el estado obtenido en la variable indicada
        this.filterFull = data;

      },
    });

  }

  ngOnInit(): void {

    // Ejecutamos la funcion para obtener los datos de la tabla
    this.getTableData();

  }

  //? Métodos de la tabla

  /**
   * Obtiene la información necesaria para construir la tabla, aplicando los filtros de
   */
  getTableData(): void {


    //*Llamo a spinner
    this.store.dispatch(new setSpinner(true));

    //* Llamo al servicio para obtener listado
    this.usersService.getWithdrawsList(this.filterFull).subscribe({
      next: (response: {data:{
        count: number
        rows: WidthdrawModel[]
      }}) => {

        //* Obtengo los datos del listado
        this.lengthList = response.data.count;

        //*Construyo la tabla
        this.buildTable(response.data.rows);

        //*Apago el spinner
        this.store.dispatch(new setSpinner(false));
      },
      error: error => {

        //*Apago el spinner
        this.store.dispatch(new setSpinner(false));

      }
    })

  }

  /**
   * Genera las filas de la tabla Se llama dentro de getTableData El modelo de tableRows es igual a lo que viene en la petición de getTableData
   * @param tableRows
   */
  buildTable(tableRows: WidthdrawModel[]): void {

    //* Creo un array que contendrá todas las filas creadas para mostrar en la tabla
    let finalRowsArray: any[] = []

    tableRows.forEach(row => {
      //*Por cada row creo un objeto con las propiedades que se mostrarán en las filas
      let finalRowObj;

      finalRowObj = {
        idWithdraw: row.idWithdraw?? CmmTableColumnErrorMsg,
        withdrawStatusName: row.withdrawStatusName??CmmTableColumnErrorMsg,
        withdrawCurrency: row.withdrawCurrency??CmmTableColumnErrorMsg,
        withdrawAmount:row.withdrawAmount?
          this.dataService.CmmAmountUserFormat(
            row.withdrawAmount,
            row.withdrawCurrency
          ) +
          ' ' +
          row.withdrawCurrency:CmmTableColumnErrorMsg,
        withdrawCreatedDate:row.withdrawCreatedDate?
          this.dataService.cmmFormatDate( row.withdrawCreatedDate ) || '--':CmmTableColumnErrorMsg,
        withdrawTargetBank: row.withdrawTargetBank??CmmTableColumnErrorMsg,
        withdrawUserName: row.withdrawUserName??CmmTableColumnErrorMsg,
        withdrawUserEmail: row.withdrawUserEmail??CmmTableColumnErrorMsg,
        withdrawPersonName:
          row.withdrawPersonName +
          ' ' +
          row.withdrawPersonSurname??CmmTableColumnErrorMsg,
        action: row.idWithdraw? {
          nameAction: 'iconFunctionAction',
          value: {
            idWithdraw: row.idWithdraw,
          },
          icon: 'launch',
          class: 'cursor-pointer',
          function: 'goWithdrawDetail',
          tooltip: 'Ver detalle',
        }:CmmTableColumnErrorMsg,
      };

      //*Añado cada fila al array
      finalRowsArray.push(finalRowObj);

    });

    //*Finalmente copio el array de filas completas para que la tabla aparezca con todo el contenido de una vez
    this.rows = [...finalRowsArray];

  }

  /**
   * Recibe el filtro actualizado y ejecuta todas las transformaciones para pasarselo a getTableData.
   * @param requestObj
   */
  requetshttp(requestObj: WithdrawFilterModel): void {

    // Si Este filtro requeire un input de fecha de inicio
    if (requestObj.startDate) {

      // Acomodo las fechas al formato que pide backend
      requestObj.startDate = this.dataService.cmmFormatDate(requestObj.startDate, 'ymd');

    }

    // Si Este filtro requeire un input de fecha de fin
    if (requestObj.endDate) {

      // Acomodo las fechas al formato que pide backend
      requestObj.endDate = this.dataService.cmmFormatDate(requestObj.endDate, 'ymd');

    }

    // En caso de que haya una fecha de inicio y de fin
    if (requestObj.startDate && requestObj.endDate) {

      // Si la fecha de inicio es mayor que la fecha de fin
      if (requestObj.startDate > requestObj.endDate) {

        // Armamos la data de la alerta
        const messagesData: CmmAlertToastrModel = {
          typeIcon: 'error',
          text: 'Formato de fecha inválido.',
        };

        // Abrimos la alerta con el mensaje de error
        this.dialogService.CmmAlertToastr(messagesData);

        return;

      };

    };


    // Si Este filtro requeire un input de monto de inicio
    if(requestObj.amountStart){

      // Acomodo el monto al formato que pide backend
      requestObj.amountStart = this.dataService.CmmAmountBackendFormat(requestObj.amountStart);

    }

    // Si Este filtro requeire un input de monto de inicio
    if(requestObj.amountEnd){

      // Acomodo el monto al formato que pide backend
      requestObj.amountEnd = this.dataService.CmmAmountBackendFormat(requestObj.amountEnd);

    }

    // En caso de que haya una monto de inicio y de fin
    if (requestObj.amountStart && requestObj.amountEnd) {

      // Si el monto de inicio es mayor que el monto de fin
      if (+requestObj.amountStart >= +requestObj.amountEnd) {
        console.log(requestObj.amountStart, requestObj.amountEnd)
        // Armamos la data de la alerta
        const messagesData: CmmAlertToastrModel = {
          typeIcon: 'error',
          text: 'El monto de inicio no puede superar el monto fin.'
        }

        // Abrimos la alerta con el mensaje
        this.dialogService.CmmAlertToastr(messagesData);

        return;

      };

    };

    //*Vació las filas
    this.rows = [];

    //*Guardo el nuevo filtro
    this.store.dispatch(
      new setWithdrawFilter({
        withdraw: requestObj,
      })
    );

    //*Vuelvo a obtener la data con los filtros actualizados
    this.getTableData();

  }

  /**
   * Con esta funcion voy a recibir el objeto del row clickeado y lo redirige a la funcion que corresponde
   * @param elementReceived
   */
  routerFunction(elementReceived: any): void {

    // En caso de que la accion realizada corresponda con ir al detalle
    if(elementReceived.function == 'goWithdrawDetail') {

      // Ejecutamos la funcion correspondiente
      this.goWithdrawDetail(elementReceived.value);

    };

  }

  /**
   * Funcion que redirige al usuario a la vista de detalle del retiro que seleccione
   */
  goWithdrawDetail(withdraw: any) {
    //*Debería ir a la vista de detalle
  }

  /**
   * Limpia el filtro de la tabla y vuelve a llamar getTableData
   */
  clearFilter(): void {

    // Reiniciamos el estado del filtro utilizado
    this.store.dispatch(new clearWithdrawFilter());

    // Reiniciamos el valor de la fecha de inicio
    this.startDate = '';

    // Reiniciamos el valor de la fecha de fin
    this.endDate = '';

    // Volvemos a solicitar la informacion para que se apliquen los filtros
    this.getTableData();

  }

  ngOnDestroy(): void {

    // Ejecutamos la funcion para limpiar los datos del filtro
    this.clearFilter();

    // terminamos cualquier proceso que estuviera pendiente
    this.$unsubscribe.next();

  }


}
