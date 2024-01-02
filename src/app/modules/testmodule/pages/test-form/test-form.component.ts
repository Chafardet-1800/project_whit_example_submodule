import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { phoneRegex } from 'commun/src/app/data/forms/models/input.models';
import { setSpinner } from 'commun/src/app/data/utils/reducer/utils.actions';
import { CmmDataService } from 'commun/src/app/services/data.service';
import { CmmDialogService } from 'commun/src/app/services/dialogs.service';
import { mustHaveLetter } from 'commun/src/app/validators/format.validator';
import { PasarelaService } from '../../services/pasarela.service';
import { CmmAlertModalModel } from 'commun/src/app/data/dialogs/models/dialogs.model';
import { CmmUtilsService } from 'commun/src/app/services/utils.service';
import { CmmComponentFormModel } from 'commun/src/app/data/forms/models/form.model';
import { CmmBanksModel } from 'commun/src/app/data/utils/models/utils.model';

@Component({
  selector: 'pag-test-form',
  templateUrl: './test-form.component.html',
  styleUrls: ['./test-form.component.scss']
})
export class TestFormComponent implements CmmComponentFormModel {

  //? Lógica de lifecicle

  /**
   * Desactiva la subscripción de observables
   */
  $unsubscribe = new Subject<void>();

  //? Variables del form

  componentForm!: FormGroup;

  //? Variables con información de utilidad para el form

  /**
   * Variable que almacena la información de los bancos nacionales filtrados por la moneda
   */
  bankList: CmmBanksModel[] = [];

  /**
   * Tipo de documento
   */
  documentTypeList: any[] = [
    {documentTypeId: '1', documentTypeName: 'V'},
    {documentTypeId: '2', documentTypeName: 'J'},
    {documentTypeId: '4', documentTypeName: 'G'},
    {documentTypeId: '6', documentTypeName: 'E'},
    {documentTypeId: '7', documentTypeName: 'P'}
  ]
  /**
   * Length mínimo del teléfono
   */
  phonelength:number = 10

  constructor(
    private store: Store,
    private pasarelaService: PasarelaService,
    private utilsService: CmmUtilsService,
    public dataService: CmmDataService,
    private dialogService: CmmDialogService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void{

    // Ejecutamos la funcion para obtener el listado de bancos
    this.getBankList();

    // Ejecutamos la funcion para crear el formulario
    this.createForm();

  }

  //? Información de utilidad

  /**
   * Llama al servicio para obtener el listado de bancos
   */
  getBankList(){

    // Hacemos la peticion a la api
    this.utilsService.CmmGetBanksList(2)
    .subscribe({
      next: response => {

        // Guardamos el listado de bancos en la variable indicada
        this.bankList = response.body.data;

        // Solo despues de tener la lista de bancos abilito el campo de bancos en el formulario
        this.componentForm?.controls['idBank']?.enable();

      },
      error: error => {}
    });

  }

  //? Metodos de formualrio
  /**
   * Inicializa pageForm
   */
  createForm():void{

    // Creo el formulario con el constructor agregando los controles necesarios
    this.componentForm = this.fb.group({
      idBank: ['',[Validators.required]],
      phoneNumber: ['',[
        Validators.required,
        Validators.minLength(this.phonelength),
        Validators.pattern(phoneRegex)
      ]],
      idDocumentType:['',[Validators.required]],
      documentNumber: ['',[
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(10),
      ]],
      amount: ['',[Validators.required]],
      description:['',[
        Validators.required,
        Validators.minLength(3),
        mustHaveLetter
      ]]
    });

    // En caso de que no haya una lista de bancos
    if(!this.bankList){

      // Inhabilito el campo de idBank, ya que sin lista no sirve
      this.componentForm.controls['idBank'].disable();

    };

    // Ejecutamos la funcion para estar atentos a los cambios en el formulario
    this.listenFormChanges();

  }

  /**
   * Aquí nos suscribimos a los cambios del form
   */
  listenFormChanges(): void{

    // Observamos cada cambio que ocurra en el campo de phoneNumber
    this.componentForm.controls['phoneNumber'].valueChanges.subscribe(value => {

      // En caso de que el valor ingresado en el campo empiece con 0
      if(value?.startsWith(0)){

        // Indicamos que el maximo de caracteres permitidos en este campo sera de 11
        this.phonelength = 11;

      }

      // En cualquier otro caso, si no empieza con cero
      else {

        // Indicamos que el maximo de caracteres permitidos en este campo sera de 11
        this.phonelength = 10;

      };

      // Se setean los nuevos validadores para el campo
      this.componentForm.controls['phoneNumber'].setValidators([
        Validators.required,
        Validators.minLength(this.phonelength),
        Validators.pattern(phoneRegex)
      ]);

    });

  }

  /**
   * Valida el formulario y decide si puede enviarse al endpoint
   * En el error ejecutamos CmmdataService.CmmSetApiError con el objeto de error del formulario
   */
  onSubmit(): void{

    // Marcamos todos controles del formaularios como marcados para rezaltar los posibles errores
    this.componentForm.markAllAsTouched();

    // Si el formulario es invalido me detengo aqui
    if(!this.componentForm.valid){
      return
    };

    // Activamos el spinner en common
    this.store.dispatch(new setSpinner(true));

    // Creo un objeto con los datos del formulario en el formato correcto para la peticion
    let returnObject = {
      ...this.componentForm.value,
      amount: this.dataService.CmmAmountBackendFormat(this.componentForm.value.amount),
    };

    // Hacemos la peticion a la api
    this.pasarelaService.returnPaymentInactiveOrder(returnObject)
    .subscribe({
      next: response => {

        // Desactivamos el spinner en common
        this.store.dispatch(new setSpinner(false));

        // Armamos la data de la alerta
        const message: CmmAlertModalModel = {
          title: response.message,
          text: '',
          typeIcon: 'success',
          showCancelButton: false,
          cancelButtonText: '',
          showConfirmButton: true,
          confirmButtonText: 'Continuar',
        };

        // Abrimos la alerta con el mensaje
        this.dialogService.CmmOpenConfirmationDialog(message);

      },
      error: error => {

        // Desactivamos el spinner en common
        this.store.dispatch(new setSpinner(false));

        //* Seteo los errores de input con su mensaje
        this.dataService.CmmSetFormApiError(error.error.data, this.componentForm);

      }
    });

  }

  /**
   * Ejecutamos el $unsubscribe
   */
  ngOnDestroy(): void{

    // terminamos cualquier proceso que estuviera pendiente
    this.$unsubscribe.next();

    // Desactivamos el spinner en common
    this.store.dispatch(new setSpinner(false));

  }

}
