import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import {
  dialogApproved,
  dialogError,
  dialogInfo,
  dialogWarning,
} from '../../../../assets/images/images-routes';
import { CmmAlertModalModel } from '../../../data/dialogs/models/dialogs.model';

@Component({
  selector: 'cmm-cmp-d-alertmessages',
  templateUrl: './alert-messages.component.html',
  styleUrls: ['./alert-messages.component.scss'],
})
export class CmmAlertMessagesComponent implements OnInit {

  /**
   * IMAGENES
   */
  dialogApproved = dialogApproved;
  dialogInfo = dialogInfo;
  dialogWarning = dialogWarning;
  dialogError = dialogError;

  /**
   * Tiempo disponible para cerrar el diálogo
   */
  timeAvailable: number = 0

  /**
   * Indica el porcentaje del spinner de progresión
   */
  spinnerProgression: number = 100

  constructor(
    public dialogRef: MatDialogRef<CmmAlertMessagesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CmmAlertModalModel,
    private router: Router
  ) {}

  ngOnInit(): void {

    //*Si pasan tiempo de cierre empiezo el contador
    if(this.data.timeLeft){
      this.dialogTimer(this.data.timeLeft)
    }
  }

  /**
   * Contador de tiempo para que se cierre el diálogo
   * @param timeLeft
   */
  dialogTimer(timeLeft: number) {

    //*Creo el observable que se encarga de contar cada segundo
    const counter = timer(1000, 1000);

    //*Me suscribo al contador y le voy restando la cuenta al tiempo de expiración
    const counterObservable = counter
      .subscribe((val) => {
        this.timeAvailable = timeLeft - val;
        // Calculo la progresión del spinner con base al tiempo dado
        this.spinnerProgression = 100 - (val * 100/timeLeft)

        //* Cuando el tiempo se acaba cierro el diálogo
        if (this.timeAvailable == 0) {
          counterObservable.unsubscribe();
          this.dialogRef.close()
        }
      });

  }
}
