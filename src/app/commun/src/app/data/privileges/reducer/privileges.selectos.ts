import { createFeatureSelector, createSelector } from "@ngrx/store";
import { PrivilegesState } from "./privileges.reducer";

export const SelectPrivilegesState = createFeatureSelector<PrivilegesState>("CmmPrivileges");

export const cmmSideNav = createSelector(
    SelectPrivilegesState,
  PrivilegesState => PrivilegesState.sidenav
)

export const cmmActions = createSelector(
    SelectPrivilegesState,
  PrivilegesState => PrivilegesState.actions
)
