import { Overlay } from '@angular/cdk/overlay';
import { Component, Input, OnInit } from '@angular/core';
//
@Component({
  selector: 'cmm-cmp-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class CmmSpinnerComponent implements OnInit {
  /**
   * Variable que indica si quiero el spinner circulo o el spinner chinchin :))
   */
  @Input() useSpinnerChinchin: boolean = true;

  constructor(public overlay: Overlay) {}

  ngOnInit(): void {
    //*Crea un overlay de material para el spinner
    this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'dark-backdrop',
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
    });
  }
}
