import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CmmUtilsStateModel } from "../models/utils.model";

export const SelectUtilsState = createFeatureSelector<CmmUtilsStateModel>("CmmUtils");


export const spinner = createSelector(
  SelectUtilsState,
  UtilsState => UtilsState.utils.spinner,
)
