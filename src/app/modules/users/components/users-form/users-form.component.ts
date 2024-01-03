import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CmmDataService } from 'src/app/commun/src/app/services/data.service';
import { CmmComponentFormModel } from 'src/app/commun/src/app/data/forms/models/form.model';
import { UsersService } from '../../services/users.service';
import { Store } from '@ngrx/store';
import { setSpinner } from 'src/app/commun/src/app/data/utils/reducer/utils.actions';
import { CmmUtilsService } from 'src/app/commun/src/app/services/utils.service';

@Component({
  selector: 'cmp-users-form',
  templateUrl: './users-form.component.html',
  styleUrls: ['./users-form.component.scss'],
})
export class UsersFormComponent implements CmmComponentFormModel  {

  /**
   * Desactiva la subscripción de observables
   */
  $unsubscribe: Subject<void> =  new Subject();

  /**
   * Formulario de depósito
   */
  componentForm!: FormGroup<any>;

  //? Información de utilidad

  /**
   * Listado de bancos
   */
  banksList: any[] = []

  constructor(
    private fb: FormBuilder,
    private listService: CmmUtilsService,
    private userService: UsersService,
    private dataService: CmmDataService,
    private store: Store
  ) {}

  ngOnInit(): void {

    // Ejecutamos la funcion para crear el formulario
    this.createForm();

    // Ejecutamos la funcion para obtener el listado de bancos
    this.getBanksList();

  }

  //? Métodos para obtener información de utilidad

  /**
   * Obtiene el listado de bancos
   */
  getBanksList() {

    // Activamos el spinner en common
    this.store.dispatch(new setSpinner(true));

    // Hacemos la peticion a la api
    this.listService.CmmGetBanksList(2)
    .pipe(
      // Indicamos que esta funcion se ejecutara hasta que el indique lo contario
      takeUntil(this.$unsubscribe)
    )
    .subscribe({
      next: (response: any) => {

        // Guardamos el listado de bancos en la variable indicada
        this.banksList = response.data;

        // Desactivamos el spinner en common
        this.store.dispatch(new setSpinner(false));

      },
      error: (error: any) => {

        // Desactivamos el spinner en common
        this.store.dispatch(new setSpinner(false));

      }
    })

  }

  //? Métodos del formulario

  /**
   * Crea el formulario de depósito
   */
  createForm(): void {

    // Creo el formulario con el constructor agregando los controles necesarios
    this.componentForm = this.fb.group({
      issuingBank: ['16', Validators.required],
      receivingBank: ['', Validators.required],
      amount: ['', Validators.required],
      date: ['', Validators.required],
      description: ['', Validators.required],
      document: ['', Validators.required],
    });

  }

  /**
   * Se suscribe al formulario y ejecuta las acciones pertinentes
   */
  listenFormChanges(): void {
    //*Por ahora no hay ninguna utilidad de esto
  }

  /**
   * Envía el formulario en caso de que esté correcto
   * @returns
   */
  onSubmit(): void {

    //* Los marco como touched para activar la validación de required
    this.componentForm.markAllAsTouched();

    //* Si el form no cumple con las validaciones no lo deja pasar
    if(this.componentForm.invalid) {
      return
    };

    //* Activo spinner
    this.store.dispatch(new setSpinner(true));

    //* Activamos el spinner en common
    this.store.dispatch(new setSpinner(true));

    //* Convierto el monto a el formato para backend
    this.componentForm.controls['amount'].patchValue(
      this.dataService.CmmAmountBackendFormat(this.componentForm.controls['amount'].value)
    );

    //* Envío el form al servicio
    this.userService.postDeposit(this.componentForm.value)
    .pipe(
      // Indicamos que esta funcion se ejecutara hasta que el indique lo contario
      takeUntil(this.$unsubscribe)
    )
    .subscribe({
      next: response => {

        //* Desactivo spinner
        this.store.dispatch(new setSpinner(false));

      },
      error: error => {

        //* Desactivo spinner
        this.store.dispatch(new setSpinner(false));

        //! No siempre se retornan errores
        this.dataService.CmmSetFormApiError(error.error.data, this.componentForm)


      }
    });

  }

  ngOnDestroy(): void {

    // terminamos cualquier proceso que estuviera pendiente
    this.$unsubscribe.next();

    // Desactivamos el spinner en common
    this.store.dispatch(new setSpinner(false));

  }
}
