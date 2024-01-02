import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ModulesState } from "./module.reducers";

export const SelectModulesState = createFeatureSelector<ModulesState>("Modules");

export const withdrawFilter = createSelector(
  SelectModulesState,
  ModulesState => ModulesState.filters.withdraw
)

export const depositFilter = createSelector(
  SelectModulesState,
  ModulesState => ModulesState.filters.deposit
)
