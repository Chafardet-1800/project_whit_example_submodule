import { Component } from '@angular/core';
import { CmmAlertModalModel, CmmAlertToastrModel, CmmQuestionDialogModel, CmmSelectDialogModel } from 'src/app/common/src/app/data/dialogs/models/dialogs.model';
import { CmmDialogService } from 'src/app/common/src/app/services/dialogs.service';

@Component({
  selector: 'cmp-test-dialogs',
  templateUrl: './test-dialogs.component.html',
  styleUrls: ['./test-dialogs.component.scss']
})
export class TestDialogsComponent {

  /**
   * Listado de tipos de diálogos
   */
  dialogTypes: any[] = [
    {
      type: 'alert-message',
      buttonText: 'Diálogo de alerta'
    },
    {
      type: 'question',
      buttonText: 'Diálogo de pregunta'
    },
    {
      type: 'selection',
      buttonText: 'Diálogo de selección'
    },
    {
      type: 'toastr',
      buttonText: 'toastr'
    },
    {
      type: 'snackbar',
      buttonText: 'snackbar'
    },
  ]

  constructor(
    private dialogService: CmmDialogService
  ) {}

  /**
   * Abre diferentes tipos de diálogos
   */
  openDialogType(type: string) {

    switch (type) {
      case 'alert-message':
        this.openAlert()
        break;
      case 'selection':
        this.openSelection()
        break;
      case 'question':
        this.openQuestion()
        break;
      case 'toastr':
        this.openToastr()
        break;
      case 'snackbar':
        this.openSnackbar()
        break;

      default:
        break;
    }

  }

  /**
   * Abre el diálogo de alerta
   */
  openAlert() {

    // Armamos la data de la alerta
    const messagesData: CmmAlertModalModel = {
      title: 'Diálogo de alerta',
      text: '',
      giftData: '',
      typeIcon: 'info',
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: 'Cerrar',
      confirmButtonText: 'Aceptar',
    };

    // Abrimos la alerta con el mensaje
    this.dialogService.CmmAlertModal(messagesData)
    .subscribe(response => {

      console.log(response);

    });

  }

  /**
   * Abre el diálogo de pregunta
   */
  openQuestion() {

    // Armamos la data de la alerta
    let data: CmmQuestionDialogModel ={
      type: true,
      method: 'depósito',
      showForm: false,
      isQuestion: true,
      title: 'Aprobar depósito bancario',
      message: ''
    }

    // Abrimos la alerta con el mensaje
    this.dialogService.CmmOpenQuestionDialog(data)
    .subscribe(response => {
      console.log(response);
    })

  }

  /**
   * Abre el diálogo de selección
   */
  openSelection() {

    // Armamos la data de la alerta
    let data: CmmSelectDialogModel = {
      title: 'Diálogo de selección',
      optionsList: this.dialogTypes,
      label: 'Diálogo de selección',
      placehoder: '',
      searchKey: 'type',
      optionValue: 'buttonText',
      siblingOptionValue: '',
      displayImages: false,
      imagesRoute: '',
      imageSearchKey: '',
      imgDimentions: {width: 0, height: 0}
    }

    // Abrimos la alerta con el mensaje
    this.dialogService.CmmOpenSelectionDialog(data)
    .subscribe(response => {
      console.log(response);
    })

  }

  /**
   * Abre el toastr
   */
  openToastr() {

    // Armamos la data de la alerta
    const messagesData: CmmAlertToastrModel = {
      typeIcon: 'info',
      text: 'Tostr informativo',
    }

    // Abrimos la alerta con el mensaje
    this.dialogService.CmmAlertToastr(messagesData);

  }

  /**
   * Abre el snackbar
   */
  openSnackbar() {
    this.dialogService.CmmOpenSnackbar('Hello there!')
  }

}
