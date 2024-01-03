import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { CmmSelectDialogModel } from '../../../data/dialogs/models/dialogs.model';
import { CmmComponentFormModel } from '../../../data/forms/models/form.model';

@Component({
  selector: 'cmm-cmp-d-selection',
  templateUrl: './selection-dialog.component.html',
  styleUrls: ['./selection-dialog.component.scss']
})
export class CmmSelectionDialogComponent implements CmmComponentFormModel {

  /**
   * Título del diálogo
   */
  title: string = ''

  /**
   * Listado de opciones
   */
  optionsList: any[] = []

  /**
   * Listado con las opciones filtradas
   */
  filteredList: any[] = []

  /**
   * Key usado para mostrar imágenes
   */
  imageSearchKey: string  = ''

  /**
   * Valor escrito en el input
   */
  optionValue: string = ''

  /**
   * Valor que acompaña al texto principal en las opciones o buscador
   */
  siblingOptionValue: string = ''

  //? Lógica de form

  /**
   * Desactiva la subscripción de observables
   */
  $unsubscribe: Subject<void> = new Subject();

  /**
   * Formulario en el que se trabajará
   */
  componentInput!: FormControl

  constructor(
    private dialogRef: MatDialogRef<CmmSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CmmSelectDialogModel,
  ) {

  }

  ngOnInit() {
    //* Le doy valor a todas las variables con la data que le pasamos al diálogo

    this.imageSearchKey = this.data.imageSearchKey
    this.optionValue = this.data.optionValue

    this.filteredList = this.data.optionsList

    this.siblingOptionValue = this.data.siblingOptionValue

    //* Creo el form
    this.createForm()

    //* Escucho los cambios del form
    this.listenFormChanges()
  }

  /**
   * Inicializa el form de búsqueda
   */
  createForm(): void {
    this.componentInput =  new FormControl('')
  }

  /**
   * Aquí nos suscribimos a los cambios del form
   */
  listenFormChanges(): void {

    //*Me suscribo a los cambios del form de búsqueda para filtrar
    this.componentInput.valueChanges.subscribe(value => {
      let valueLength = value.length

      //* Genero una lista con valores que incluyan lo que está siendo escrito
      this.filteredList = this.data.optionsList.filter(option => (option[this.optionValue].substring(0,valueLength)).toLowerCase() == value.toLowerCase())
    })

  }

  /**
   * Cierra el diálogo y envía la opción seleccionada
   * @param selected
   */
  selectOption(selected: any){
    this.dialogRef.close(selected[this.optionValue])
  }

  onSubmit(): void {

  }

  ngOnDestroy(): void {
  }

}
