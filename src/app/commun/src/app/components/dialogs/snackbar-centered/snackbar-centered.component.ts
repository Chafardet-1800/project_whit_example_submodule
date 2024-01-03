import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar-centered',
  templateUrl: './snackbar-centered.component.html',
  styleUrls: ['./snackbar-centered.component.scss']
})

export class CmmSnackbarCenteredComponent {

  constructor(
     @Inject(MAT_SNACK_BAR_DATA)  public data: any
  ){}

}
