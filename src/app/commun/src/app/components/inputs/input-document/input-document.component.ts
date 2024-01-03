import { Component, Input } from '@angular/core';

@Component({
  selector: 'cmp-input-document',
  templateUrl: './input-document.component.html',
  styleUrls: ['./input-document.component.scss']
})
export class InputDocumentComponent {

  @Input() documentTypeList: any[] = []

  constructor() {}

  //? Métodos de ciclo de vida

  ngOnInit() {

  }

  ngOnChanges() {

  }

}
