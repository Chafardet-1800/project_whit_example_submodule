import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CmmModuleActionOption } from '../../../data/privileges/models/privileges.models';
@Component({
  selector: 'cmp-cmm-options-menu',
  templateUrl: './cmm-options-menu.component.html',
  styleUrls: ['./cmm-options-menu.component.scss']
})
export class CmmOptionsMenuComponent {


  /**
   * Título de la página en la que me encuentro
   */
  @Input() title: string = ''

  /**
   * Opciones a mostrar en el menú
   */
  @Input() operationOptions: CmmModuleActionOption[] = []

  /**
   * Indica en que menú de operaciones estamos
   */
  @Input() operationMenu: string = ''

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute
  ){}

  //? Métodos de ciclo de vida

  ngOnInit() {
  }

  /**
   * Se encarga de enviarte a la opción seleccionada
   * @param operationMenu
   */
  chooseOption(operationMenu: CmmModuleActionOption) {
    this.transformUrlLinks(operationMenu.url)
  }

  /**
   * Transforma los links de url de las opciones
   */
  transformUrlLinks(urlLink: string) {
    this.router.navigate([urlLink])
  }
}
