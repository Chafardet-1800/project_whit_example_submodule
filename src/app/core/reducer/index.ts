import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { ModulesReducer, ModulesState } from './module.reducers';
import { TablesReducer, TablesState } from 'commun/src/app/data/tables/reducer/tables.reducer';
import { UtilsReducer } from 'commun/src/app/data/utils/reducer/utils.reducer';
import { CmmUtilsStateModel } from 'commun/src/app/data/utils/models/utils.model';

export interface AppState {
  CmmTable: TablesState;
  Modules: ModulesState;
  CmmUtils: CmmUtilsStateModel
}

// Esto es lo mismo que estaba en el app module solo que ahora en una variable
export const reducers: ActionReducerMap<AppState, any> = {
  CmmTable: TablesReducer,
  Modules: ModulesReducer,
  CmmUtils: UtilsReducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : [];
