import { CmmActionListModel, CmmSideNavModel } from "../models/privileges.models"
import { PrivilegesActions, PrivilegesActionsTypes } from "./privileges.actions"

export interface PrivilegesState {
   sidenav: CmmSideNavModel[],
   actions: CmmActionListModel[]
}

export const initialPrivilegesState: PrivilegesState = {
   sidenav: [],
   actions: []
}

export function PrivilegesReducer(
    state = initialPrivilegesState,
    action: PrivilegesActions
  ) {
    switch (action.type) {

      // Acciones de seteo de sideNav
      case PrivilegesActionsTypes.SetSideNav:
        return {
          ...state,
          sidenav: action.payload
        }
      case PrivilegesActionsTypes.ClearSideNav:
        return {
          ...state,
          sidenav: []
        }

      // Acciones de seteo de acciones
      case PrivilegesActionsTypes.SetActionList:
        return {
          ...state,
          actions: action.payload
        }
      case PrivilegesActionsTypes.ClearActionList:
        return {
          ...state,
          actions: []
        }

      // Acciones genrales de este reducer
      case PrivilegesActionsTypes.ClearPrivileges:
        return {
          sidenav: [],
          actions: []
        }

      default:
        return state;
    }
  }
