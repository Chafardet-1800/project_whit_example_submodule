import { Action } from "@ngrx/store";
import { DepositFilterModel, WithdrawFilterModel } from "./module.models";

export enum ModulesActionsTypes {
  // modulo de retiro
  WithdrawFilter = '[Withdraw filter] Withdraw filter',
  ClearWithdrawFilter = '[Clear withdraw filter] Clear withdraw filter',

  // modulo de deposito
  DepositFilter = '[Deposit filter] Deposit filter',
  ClearDepositwFilter = '[Clear deposit filter] Clear deposit filter',

  //reducer genereal
  ModulesFilterClear = '[Modules filterClear] Modules filterClear'
}

// Acciones del modulo de retiro
export class setWithdrawFilter implements Action {
  readonly type = ModulesActionsTypes.WithdrawFilter;

  constructor(public payload: { withdraw: WithdrawFilterModel }) {}
}
export class clearWithdrawFilter implements Action {
  readonly type = ModulesActionsTypes.ClearWithdrawFilter;

  constructor() {}
}


// Acciones del modulo de deposito
export class setDepositFilter implements Action {
  readonly type = ModulesActionsTypes.DepositFilter;

  constructor(public payload: { deposit: DepositFilterModel }) {}
}
export class clearDepositFilter implements Action {
  readonly type = ModulesActionsTypes.ClearDepositwFilter;

  constructor() {}
}

// Acciones del reducer general
export class modulesFilterClear implements Action {
  readonly type = ModulesActionsTypes.ModulesFilterClear;

  constructor() {}
}

export type ModulesActions =  setWithdrawFilter |
                              clearWithdrawFilter |

                              setDepositFilter |
                              clearDepositFilter|

                              modulesFilterClear;
