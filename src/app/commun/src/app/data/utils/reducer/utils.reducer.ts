import { UtilsActionTypes, UtilsActions } from "./utils.actions";
import { CmmUtilsStateModel } from "../models/utils.model";

export const initialSpinnerState: boolean = false

export const initialUtilsState: CmmUtilsStateModel = {
  utils: {
    spinner: initialSpinnerState
  }
}

export function UtilsReducer(
  state:CmmUtilsStateModel = initialUtilsState,
  action: UtilsActions
) {
  switch (action.type) {
    case UtilsActionTypes.SetSpinner:
      return {
        utils: {
          ...state.utils,
          spinner: action.payload
        }
      }
    default:
      return state
  }
}
