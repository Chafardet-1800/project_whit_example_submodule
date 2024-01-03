import { Component, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  coverAccessDenied,
  coverApproved,
  coverApprovedValidation,
  coverEmptyState,
  coverNoPrivilege,
  coverPending,
  coverRejected,
  coverWarning,
} from '../../../../assets/images/images-routes';
import { CmmActionListModel } from '../../../data/privileges/models/privileges.models';
import { cmmActions } from '../../../data/privileges/reducer/privileges.selectos';
import { spinner } from '../../../data/utils/reducer/utils.selector';

@Component({
  selector: 'cmm-cmp-c-cover',
  templateUrl: './cover.component.html',
  styleUrls: ['./cover.component.scss'],
})
export class CmmCoverComponent {
  /**
   * Desactiva la suscripción a los servicios
   */
  private unsubscribe = new Subject<void>();

  /**
   * Título del cover
   */
  @Input() title: string =
    'Usted no tiene privilegios para ver esta sección. Por favor, contácte a su administrador.';
  /**
   * Mensaje del cover
   */
  @Input() message: string = '';
  /**
   * Tipo de imagen que mostrará el cover
   */
  @Input() coverType: string = '';
  /**
   * Nombre del privilegio que falta (Se muestra si el cover es de tipo noPrivilege)
   */
  @Input() privilege: string = '';

  /**
   * IMAGENES
   */
  coverAccessDenied = coverAccessDenied;
  coverApprovedValidation = coverApprovedValidation;
  coverApproved = coverApproved;
  coverPending = coverPending;
  coverWarning = coverWarning;
  coverEmptyState = coverEmptyState;
  coverRejected = coverRejected;
  coverNoPrivilege = coverNoPrivilege;

  //? Lógica de privilegios

  /**
   * Valarible que contiene el listado de todas las acciones con sus keys
   */
  actionsList: CmmActionListModel[] = [];

  /**
   * Variable que obtiene el listado de acciones del proyecto
   */
  actions$: Observable<any>;

  /**
   * Indica si ocultamos el cover
   */
  hideCover: boolean = false

  constructor(
    private store: Store
  ) {
    this.actions$ = store.pipe(select(cmmActions));
  }

  ngOnInit() {

    //*Me suscribo a los cambios del spinner
    this.listenSpinnerChanges()

    //* Obtengo las acciones si el cover lo requiere
    if (this.coverType == 'noPrivilege') {
      this.getActions()
    }
  }

  /**
   * Obtiene las acciones del usuario
   */
  getActions() {
    this.actions$.pipe(takeUntil(this.unsubscribe)).subscribe(
      (data: CmmActionListModel[]) => {
        this.actionsList = data
      }
    )
  }

  /**
   * Funcion para obtener el nombre de una accion
   */
  getActionName(key: string): String {
    const action = this.actionsList.find((action: any) => action.key == key);
    return action?.actionName || key
  }

  /**
   * Está pendiente de los cambios de spinner
   */
  listenSpinnerChanges() {

    //*Obtengo el estado actual del spinner
    this.store.select(spinner).subscribe(spinnerActive => {
      //*Escondo el cover si el spinner está en true
      this.hideCover = spinnerActive
    })
  }
}
