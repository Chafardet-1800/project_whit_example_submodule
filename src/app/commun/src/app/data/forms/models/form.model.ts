import { OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Subject } from "rxjs";

/**
 * Interfaz con la lógica esencial de un componente de formulario
 */
export declare interface CmmComponentFormModel extends OnInit, OnDestroy{

  //? Lógica de lifecicle

  /**
   * Desactiva la subscripción de observables
   */
  $unsubscribe: Subject<void>

  //? Variables del form

  /**
   * Formulario en el que se trabajará (Aplica si el form es de más de un input)
   */
  componentForm?: FormGroup

  /**
   * Formcontrol en el que se trabajará (Aplica si el form es de un solo input)
   */
  componentInput?: FormControl

  //? Variables con información de utilidad para el form

  /**
   * Se llama createForm
   */
  ngOnInit(): void;

  /**
   * Inicializa pageForm
   */
  createForm():void;

  /**
   * Aquí nos suscribimos a los cambios del form
   */
  listenFormChanges?(): void;

  /**
   * Valida el formulario y decide si puede enviarse al endpoint
   * En el error ejecutamos CmmdataService.CmmSetApiError con el objeto de error del formulario
   */
  onSubmit(): void;

  /**
   * Ejecutamos el $unsubscribe
   */
  ngOnDestroy(): void;

}
