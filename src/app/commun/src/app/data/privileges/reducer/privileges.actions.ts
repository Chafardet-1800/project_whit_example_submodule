import { Action } from "@ngrx/store";
import { CmmActionListModel, CmmSideNavModel } from "../models/privileges.models";

export enum PrivilegesActionsTypes {
    // Menu lateral
    SetSideNav = '[Set SideNav] Set SideNav',
    ClearSideNav = '[Clear SideNav] Clear SideNav',
    // Listado de acciones
    SetActionList = '[Set ActionList] Set ActionList',
    ClearActionList = '[Clear ActionList] Clear ActionList',
    // Acciones genrales del reducer
    ClearPrivileges = '[Clear Privileges] Clear Privileges',
}


// Acciones que afectan el Sidenav
export class setSideNav implements Action {
  readonly type = PrivilegesActionsTypes.SetSideNav;

  constructor(public payload: CmmSideNavModel[]) {}
}
export class clearSideNav implements Action {
  readonly type = PrivilegesActionsTypes.ClearSideNav;
}


// Acciones que afectan el Sidenav
export class setActionList implements Action {
  readonly type = PrivilegesActionsTypes.SetActionList;

  constructor(public payload: CmmActionListModel[]) {}
}
export class clearActionList implements Action {
  readonly type = PrivilegesActionsTypes.ClearActionList;
}


// Acciones generales de reducer
export class clearPrivileges implements Action {
  readonly type = PrivilegesActionsTypes.ClearPrivileges;
}


export type PrivilegesActions = setSideNav |
                                clearSideNav |
                                setActionList |
                                clearActionList |
                                clearPrivileges
