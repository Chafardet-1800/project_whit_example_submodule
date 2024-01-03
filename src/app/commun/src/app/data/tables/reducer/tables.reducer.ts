import { CmmTablesFilterModel } from '../models/tables.model';
import { TablesActions, TablesActionsTypes } from './tables.actions';

export interface TablesState {
  filter: CmmTablesFilterModel;
}
export const initialTablesFilter: CmmTablesFilterModel = {
  limit: '10',
  page: '0',
  search: '',
  username: '',
  amountStart: '',
  amountEnd: '',
  exchangeRate: '',
  startDate: '',
  endDate: '',
  idStatus: '',
  isCompany: false,
  idCurrencySend: '',
  idCurrencyReceive: '',
  idCurrency: '',
  amount: '',
  isPartial: undefined,
  idPaymentMethod: '',
};

export const initialTablesState: TablesState = {
  filter: initialTablesFilter,
};

export function TablesReducer(
  state = initialTablesState,
  action: TablesActions
) {
  switch (action.type) {

    // Accion para actualizar el estado del filtro
    case TablesActionsTypes.filter:
      return {
        ...state,
        filter: action.payload.filter,
      };

    // Accion para reiniciar el estado del filtro
    case TablesActionsTypes.filterClearTables:
      return {
        ...state,
        filter: initialTablesFilter,
      };

    default:
      return state;
  }
}
