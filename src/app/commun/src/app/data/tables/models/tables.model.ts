import { OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";

/**
 * Interfaz objeto filtros para las tablas
 */
export interface CmmTablesFilterModel {
  limit: string;
  page: string;
  search: string;
  username: string;
  amountStart: string | number;
  amountEnd: string | number;
  exchangeRate: string | number;
  startDate: string;
  endDate: string;
  idStatus: string | number;
  isCompany: boolean;

  idCurrencySend?: string | number;
  idCurrencyReceive?: string | number;
  amount?: string | number;
  isPartial?: boolean;
  idPaymentMethod?: string | number;
  idCurrency?: string | number;
}


/**
   * Mensaje de error para columna sin data
   */
export const CmmTableColumnErrorMsg: string = 'N/A'

/**
 * Interface para los headers de la tabla comun
 */
export interface CmmTableHeader {
  text: string;
  field: string;
  action: boolean;
  cssClass: string;
}

/**
 * Interface para las filas de la tabla comun
 */
export interface CmmTableRow {
  nameAction: string
  value: any
  class: string
  statusObject?: CmmStatusModel
  function: string
  tooltip: string
}

/**
 * Interface para los estatus que acepta la tabla con sus estilos
 */
export interface CmmStatusModel {
  text: string,
  badge: string,
  imgClass: string
}


/**
 * Tipo de estatus que acepta la tabla con sus estilos
 */
export type CmmStatusType  = 'success' | 'warning' | 'error' | 'info'| 'neutral'|'info_alt'

/**
 * Interface para cada estilo que se quiera usar en la tabla
 */
export interface CmmStatusDictionaryModel {
  statusName: string,
  statusType: CmmStatusType
}

/**
 * Interface para cada grupo de estilo que se quiera usar en la tabla
 */
export interface CmmStatusTypeGroupsModel {
  statusGroup: string[],
  statusType: CmmStatusType
}


/**
 * Interfaz con la lógica esencial de una vista que usa la tabla de common
 */
export declare interface CmmComponentTableModel extends OnInit, OnDestroy{

  //? Lógica de lifecicle

  /**
   * Desactiva la subscripción de observables
   */
  $unsubscribe: Subject<void>

  //? Variables de la tabla

  /**
   * Encabezados de la tabla
   */
  header: CmmTableHeader[]

  /**
   * Array de filas de la tabla
   */
  rows: CmmTableRow[]

  /**
   * Cantidad de filas de la tabla
   */
  lengthList: number

  /**
   * Objeto con los filtros de la tabla
   */
  filterFull: any

  /**
   * Objeto para crear los inputs de filtros que tendra la tabla
   */
  filtersObject: any

  /**
   * Observable de suscripción al store con los filtros de la tabla
   */
  $filter: any

  /**
   * Objeto para crear grupos de estatus asociados a un tipo de color
   */
  statusDictionary: CmmStatusTypeGroupsModel[]

  //?Variables fechas para no usar la utc en la peticion

  /**
   * Filtro de fecha inicial de tabla
   */
  startDate: string

  /**
   * Filtro de fecha final de tabla
   */
  endDate: string

  //? Lógica de privilegeios

  /**
   * Listado de acciones que existen en el módulo
   */
  actionKeys?: string[]

  /**
   * Dentro de cada constructor se suscriben los observables:
   * @example
   * constructor() {
      * this.filter$ = this.store.pipe(select(clientFilter));
        this.filter$.pipe(takeUntil(this._unsubscribe)).subscribe({
          next: (data) => {
            this.filterFull = data;
          },
        });
   * }
   *
   *
   */

  /**
   * Se valida primero si tengo la acción para llamar al endpoint con CmmdataService.hasPrivilege, en caso positivo llamamos getTableData
   * @example:
   *
    if (this.dataService.hasPrivilege(actionKeys.['cualquier acción del modulo'])) {
      this.getCompaniesList();
    }
   */
  ngOnInit(): void;

  //? Métodos para obtener información para construir tabla

  /**
   * Obtiene la información necesaria para construir la tabla, aplicando los filtros de
   */
  getTableData(): void;

   /**
   * Genera las filas de la tabla
   * Se llama dentro de getTableData
   * El modelo de tableRows es igual a lo que viene en la petición de getTableData
   */
   buildTable(tableRows: any[]): void;

  //? Lógica de manejo de información de la tabla

  /**
   * Recibe el filtro actualizado y ejecuta todas las transformaciones para pasarselo a getTableData.
   * @param requestObj Es el objeto de filtro con los valores actualizados desde los inputs de la tabla
   * @example:
   *
   * this.rows = [];

    this.store.dispatch(
      new setTableFilter({
        filter: requestObj,
      })
    );

    this.filter$.pipe(takeUntil(this._unsubscribe)).subscribe({
      next: (data) => {
        this.filterFull = data;
      },
    });

    this.getTableData();
   */
  requetshttp(requestObj:any): void;

  /**
   *
   * @param elementReceived Con esta funcion voy a recibir el objeto del row clickeado y lo redirige a la funcion que corresponde
   *
   * Ej:
   *
  } @example
    {
      if (
        elementReceived.function == "updateServiceStatus" &&
        this.dataService.hasPrivilege(basicServicesPrivileges.basicServicesUpdateStatus))
      {
        this.updateServiceStatus(elementReceived.value);
      } else if (
        elementReceived.function == "openBasicServiceUpdateDialog" &&
        this.dataService.hasPrivilege(basicServicesPrivileges.basicServicesUpdateAmounts))
      {
        this.openBasicServiceUpdateDialog(elementReceived.value);
      }
   */
  routerFunction(elementReceived: any): void

  /**
   * Limpia el filtro de la tabla y vuelve a llamar getTableData
   */
  clearFilter(): void;

  /**
   * Ejecutamos el $unsubscribe y el reducer para limpiar filtros
   * @example:
   *  this._unsubscribe.next();
      this.store.dispatch(new clearTableFilter());
   */
  ngOnDestroy(): void;
}
