import { Action } from '@ngrx/store';
import { CmmTablesFilterModel } from '../models/tables.model';

export enum TablesActionsTypes {
  filter = '[Tables filter] Tables Filter',
  filterClearTables = '[Tables filterClear] Tables filterClear',
}

/**
 * Accion para limpiar la tabla
 */
export class filterClearTables implements Action {
  readonly type = TablesActionsTypes.filterClearTables;

  constructor() {}
}

/**
 * Accion para actualizar el estado del filtro
 */
export class filterTables implements Action {
  readonly type = TablesActionsTypes.filter;

  constructor(public payload: { filter: CmmTablesFilterModel }) {}
}

export type TablesActions = filterClearTables | filterTables;
