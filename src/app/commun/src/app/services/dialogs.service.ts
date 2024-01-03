import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { CmmAlertMessagesComponent } from '../components/dialogs/alert-messages/alert-messages.component';
import { CmmSelectionDialogComponent } from '../components/dialogs/selection/selection-dialog.component';
import { CmmToastrComponent } from '../components/dialogs/toastr/toastr.component';
import { CmmInputQuestionDialogComponent } from '../components/dialogs/input-question-dialog/input-question-dialog.component';
import { CmmSnackbarCenteredComponent } from '../components/dialogs/snackbar-centered/snackbar-centered.component';
import { CmmAlertModalModel, CmmAlertToastrModel, CmmQuestionDialogModel, CmmSelectDialogModel } from '../data/dialogs/models/dialogs.model';

@Injectable()
export class CmmDialogService {

  constructor(public dialog: MatDialog, private snackbar: MatSnackBar) {}

  /**
   * @description Abre el diálogo de alerta
   * @param {CmmAlertModalModel} alertData Data necesaria par ael uso de este servicio
   * @returns La respuesta generada al cierre del dialogo
   */
  CmmAlertModal( alertData: CmmAlertModalModel) {

    // Abrimos el componente predeterminado con la data suministrada
    const dialogRef = this.dialog.open(CmmAlertMessagesComponent, {
      width: '450px',
      data: alertData,
      disableClose: true,
      autoFocus: false,
    });

    // Retornamos el resultado del cierre
    return dialogRef.afterClosed();

  }

  /**
   * @description Toast general con mensajes de éxito, alerta y error
   * @param {CmmAlertToastrModel} toastrData Data necesaria par ael uso de este servicio
   */
  CmmAlertToastr(toastrData: CmmAlertToastrModel) {

    // Abrimos el componente predeterminado con la data suministrada
    this.snackbar.openFromComponent(CmmToastrComponent, {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      data: toastrData,
      duration: 15000,
      panelClass: ['alertPrincipalStyle'],
    });

  }

  /**
   * @description Abre el diálogo de confirmación
   * @param {CmmAlertModalModel} alertConfirmationData Data necesaria par ael uso de este servicio
   * @returns La respuesta generada al cierre del dialogo
   */
  CmmOpenConfirmationDialog(alertConfirmationData: CmmAlertModalModel): Observable<boolean> {

    // Abrimos el componente predeterminado con la data suministrada
    const dialogRef = this.dialog.open(CmmAlertMessagesComponent, {
      width: '500px',
      data: alertConfirmationData,
      disableClose: true,
      autoFocus: false,
    });

    // Retornamos el resultado del cierre
    return dialogRef.afterClosed();

  }

  /**
   * @description Abre el diálog de cerrar sesión
   * @param {CmmAlertModalModel} CloseSessionData Data necesaria par ael uso de este servicio
   * @returns La respuesta generada al cierre del dialogo
   */
  CmmOpenCloseSessionDialog(CloseSessionData: CmmAlertModalModel): Observable<string> {

    // Abrimos el componente predeterminado con la data suministrada
    const dialogRef = this.dialog.open(CmmAlertMessagesComponent, {
      width: '500px',
      data: CloseSessionData,
      disableClose: true,
      autoFocus: false,
    });

    // Retornamos el resultado del cierre
    return dialogRef.afterClosed();

  }

  /**
   * @description Abre el diálogo de selección
   * @param {SelectDialogModel} selectionDialogData Data necesaria par ael uso de este servicio
   * @returns La respuesta generada al cierre del dialogo
   */
  CmmOpenSelectionDialog(selectionDialogData: CmmSelectDialogModel): Observable<any> {

    // Abrimos el componente predeterminado con la data suministrada
    const dialogRef = this.dialog.open(CmmSelectionDialogComponent, {
      width: '500px',
      data: selectionDialogData,
      autoFocus: false,
      disableClose: false,
    });

    // Retornamos el resultado del cierre
    return dialogRef.afterClosed();

  }

  /**
   * @description Abre el diálogo de pregunta (Confirmar/Rechazar)
   * @param {QuestionDialogModel} questionDialogData Data necesaria par ael uso de este servicio
   * @returns La respuesta generada al cierre del dialogo
   */
  CmmOpenQuestionDialog(questionDialogData: CmmQuestionDialogModel) {

    // Abrimos el componente predeterminado con la data suministrada
    const dialogRef = this.dialog.open(CmmInputQuestionDialogComponent, {
      width: '500px',
      data: questionDialogData,
      autoFocus: false,
      disableClose: false,
    });

    // Retornamos el resultado del cierre
    return dialogRef.afterClosed();

  }

  /**
   * @description Abre el snackbar
   * @param text mensaje que se quiere mostrar
   */
  CmmOpenSnackbar(text: string) {

    // Abrimos el componente predeterminado con la data suministrada
    this.snackbar.openFromComponent(CmmSnackbarCenteredComponent, {
      duration: 2000,
      data: text
    })

  }

  /**
   * @description Cierra todos los diálogos abiertos
   * @returns La respuesta generada al cierre del dialogo
   */
  CmmCloseAllDialogs() {

    // Retornamos el resultado del cierre
    return this.dialog.closeAll();

  }
}
