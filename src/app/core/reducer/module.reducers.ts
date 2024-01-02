import { ModulesActions, ModulesActionsTypes } from "./module.actions";
import { DepositFilterModel, WithdrawFilterModel } from './module.models';
export interface ModulesState {
  filters: {
    withdraw: WithdrawFilterModel,
    deposit: DepositFilterModel,
  };
}

export const initialWidrawFilter: WithdrawFilterModel = {
  limit: '10',
  page: '0',
  search: '',
  startDate: '',
  endDate: '',
  amountStart: '',
  amountEnd: '',
  idWithdrawStatus: '',
  idWithdrawCurrency: '',
};

export const initialDepositFilter: DepositFilterModel = {
  limit: '10',
  page: '0',
  search: '',
  startDate: '',
  endDate: '',
  amountStart: '',
  amountEnd: '',
  idDepositStatus: '',
  idDepositCurrency: '',
};

export const initialModuleFilter: ModulesState = {
  filters: {
    withdraw: initialWidrawFilter,
    deposit: initialDepositFilter,
  }
}

export function ModulesReducer(
  state = initialModuleFilter,
  action: ModulesActions
) {
  switch (action.type) {

    // Acciones de retiro
    case ModulesActionsTypes.WithdrawFilter:
      return {
        filters: {
          ...state.filters,
          withdraw: action.payload.withdraw
        }
      }
    case ModulesActionsTypes.ClearWithdrawFilter:
      return {
        filters: {
          ...state.filters,
          withdraw: initialWidrawFilter
        }
      }

    // Acciones de deposito
    case ModulesActionsTypes.DepositFilter:
      return {
        filters: {
          ...state.filters,
          deposit: action.payload.deposit
        }
      }
    case ModulesActionsTypes.ClearDepositwFilter:
      return {
        filters: {
          ...state.filters,
          deposit: initialDepositFilter
        }
      }

    // Accion General
    case ModulesActionsTypes.ModulesFilterClear:
      return {
        filters: {
          deposit: initialDepositFilter,
          withdraw: initialWidrawFilter
        }
      }

    default:
      return state;
  }
}
