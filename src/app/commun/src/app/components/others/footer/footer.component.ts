import { Component, Input } from '@angular/core';

@Component({
  selector: 'cmm-cmp-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class CmmFooterComponent {

  /**
   * Nombre del entorno
   */
  @Input() envName: string = ''

  /**
   * Versión del proyecto
   */
  @Input() envVersion: string = ''
  
}
