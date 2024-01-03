import { Action } from "@ngrx/store";

export enum UtilsActionTypes {
  //*Acción de setear spinner
  SetSpinner = '[Set spinner] Set spinner'
}

export class setSpinner implements Action {
  readonly type = UtilsActionTypes.SetSpinner;

  constructor(public payload: boolean) {
  }
}


export type UtilsActions = setSpinner
