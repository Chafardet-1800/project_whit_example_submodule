import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'cmm_p_safe_url',
})
export class CmmSafeUrlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Funcion para asegurar un enlace que se quiera usar
   * @param url enlace que se quiere asegurar
   * @returns el enlace arreglado
   */
  transform(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
