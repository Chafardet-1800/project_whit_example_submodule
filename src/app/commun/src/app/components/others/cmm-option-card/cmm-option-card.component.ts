import { Component, Input, SimpleChanges } from '@angular/core';
import { CmmModuleActionOption } from '../../../data/privileges/models/privileges.models';

@Component({
  selector: 'cmp-cmm-option-card',
  templateUrl: './cmm-option-card.component.html',
  styleUrls: ['./cmm-option-card.component.scss']
})
export class CmmOptionCardComponent {
  /**
   * Información de la operación
   */
  @Input() optionInfo!: CmmModuleActionOption

  /**
   * Indica si la operación es de usar fondos o agregar fondos
   */
  @Input() operationType: string = ''

  /**
   * Tipos de operación
   */
  operationTypes: any

  constructor(

  ) {

  }

  ngOnChanges(changes: SimpleChanges) {
  }
}
