import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cmm_p_object_list'
})

export class CmmObjectList implements PipeTransform {

  /**
   * Convierte un listado de strings a un listado de objetos, donde cada valor está dentro de la propiedad "value"
   */
  transform(list: string[]): any[] {

    // Variable que contendra el nuevo arreglo con los objetos
    let newObjectsList: any[] = []

    // Itero por cada uno de los elementos del array
    list.forEach((option: string) => {

      // Agrego al array final un objeto con la opcion como valor del parametro value
      newObjectsList.push({
        value: option
      })

    })

    // Retorno el nuevo arreglo con los valores dados
    return newObjectsList;

  }

}
