import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { CmmQuestionDialogModel } from '../../../data/dialogs/models/dialogs.model';
import { CmmComponentFormModel } from '../../../data/forms/models/form.model';

@Component({
  selector: 'cmm-cmp-d-input-question-dialog',
  templateUrl: './input-question-dialog.component.html',
  styleUrls: ['./input-question-dialog.component.scss'],
})
export class CmmInputQuestionDialogComponent implements CmmComponentFormModel {
  /**
   * Formulario
   */
  questionForm!: FormGroup;

  /**
   * Desactiva la subscripción de observables
   */
  $unsubscribe: Subject<void> = new Subject();

  /**
   * Formulario en el que se trabajará
   */
  componentInput!: FormControl

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA)
    public inputData: CmmQuestionDialogModel,
    public fb: FormBuilder
  ) {}


  ngOnInit() {

    // Inicializo el formulario si showForm es true (osea que necesita alguna respuesta), si es false es practicamente un warning dialog
    if (this.inputData.showForm) {
      this.createForm()
    }
  }

  /**
   * Inicializo el formControl
   */
  createForm(): void {
    this.componentInput = new FormControl('', [Validators.required, Validators.maxLength(100), Validators.minLength(3)])
  }

  /**
   *
   * @returns Funcion que valida el form y cierra el dialog
   */
  onSubmit(): void {
    // Valido el form solo si showForm es true
    if (this.inputData.showForm) {
      this.componentInput.markAllAsTouched()
      if (!this.componentInput.valid) {
        return;
      }
    }

    // Cierro el dialog y mando la informacion al componente padre
    this.dialogRef.close({
      data: this.inputData.showForm
        ? this.componentInput.value
        : null,
      isApproved: this.inputData.type,
    });
  }

  ngOnDestroy(): void {

  }
}
