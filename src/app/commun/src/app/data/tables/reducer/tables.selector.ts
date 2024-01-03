import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TablesState } from './tables.reducer';

export const SelectOperationState =
  createFeatureSelector<TablesState>('CmmTable');

export const filterFull = createSelector(
  SelectOperationState,
  (TablestState) => TablestState.filter
);
