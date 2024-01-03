import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { CmmAlertToastrModel } from '../../../data/dialogs/models/dialogs.model';

@Component({
  selector: 'cmm-cmp-d-toastr',
  templateUrl: './toastr.component.html',
  styleUrls: ['./toastr.component.scss'],
})
export class CmmToastrComponent implements OnInit {
  showAlert: string = '';
  alertDisplay: string = '';
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: CmmAlertToastrModel,
    public snackBarRef: MatSnackBarRef<any>
  ) {}

  ngOnInit(): void {
    //* Obtengo el tipo de ícono
    this.setTypeIcon()
  }

  /**
   * Setea el tipo de ícono a mostrar
   */
  setTypeIcon() {
    switch (this.data.typeIcon) {
      case 'success':
        this.data.icon = 'check_circle';
        break;
      case 'error':
        this.data.icon = 'highlight_off';
        break;
      case 'warning':
        this.data.icon = 'report_problem';
        break;
      case 'info':
        this.data.icon = 'info';
        break;
      default:
        this.data.icon = '';
        break;
    }
  }

  /**
   * Función para cerrar el toastr automáticamente después de 1 segundo
   */
  change = () => {
    //*Seteo la opacidad
    this.showAlert = '0';

    //*Inicio el contador de cierre
    setTimeout(() => {
      this.snackBarRef.dismissWithAction();
    }, 1000);
  };
}
