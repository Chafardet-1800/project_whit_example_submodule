import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { selectModes } from 'src/app/common/components/inputs/input-select/input-select.component';
import { CmmComponentFormModel } from 'src/app/common/data/forms/models/form.model';
import { fileSize, fileType, passwordValidators } from 'src/app/common/validators/format.validator';

@Component({
  selector: 'cmp-test-inputs',
  templateUrl: './test-inputs.component.html',
  styleUrls: ['./test-inputs.component.scss']
})
export class TestInputsComponent implements CmmComponentFormModel {

  /**
   * Desactiva la subscripción de observables
   */
  $unsubscribe: Subject<void> = new Subject();

  /**
   * Formulario en el que se trabajará
   */
  componentForm!: FormGroup<any>;

  //? Para el input-select

  /**
   * Lista para probar input-select
   */
  selectList: any[] = [
    {
      id: '1',
      name: 'vacas vaqueras',
      img: 'chinchin_approved'
    },
    {
      id: '2',
      name: 'vacas empresarias, estas opción es absurdamente larga',
      img: 'chinchin_pending'
    },
    {
      id: '3',
      name: 'vacas policías',
      img: 'chinchin_warning'
    },
    {
      id: '4',
      name: 'vacas drogadictas',
      img: 'chinchin_approved'
    },
  ]

  /**
   * Tipo de modo del input-select que está activo
   */
  selectMode: selectModes = 'select'

  /**
   * Tipos de modos de selección
   */
  selectModes: selectModes[] = ['autocomplete','select','dialog']

  //? Para el input de OTP

  /**
   * Indica si se pide o no el token
   */
  tokenRequested: boolean = false

  tokenRequested1: boolean = false

  //? Para tryCatch


  /**
   * Variable que va a decir si hubo un error de trycatch
   */
  tryCatchError: boolean = false;

  /**
   * Variable con el codigo donde hubo el error de trycatch (trackingCode string)
   */
  tryCatchCode: string = '';

  constructor(
    private fb: FormBuilder,
  ){}

  ngOnInit(): void {

    // Ejecutamos la funcion para crear el formulario
    this.createForm();

  }

  /**
   * Inicializa componentForm
   */
  createForm(): void {

    // Creo el formulario con el constructor agregando los controles necesarios
    this.componentForm = this.fb.group({
      select: [''],
      selectMode: [''],
      email: [''],
      text: ['', Validators.pattern('^(?=.*\d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[-\#\$\.\%\&\*])(?=.*[a-zA-Z]).{8,16}$')],
      amount: [''],
      otp: [''],
      otp2: [''],
      password: ['', passwordValidators],
      file: ['', [fileSize(2), fileType('x-zip-compressed', 'jpeg'), Validators.required]],
      singleDate: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });

  }

  /**
   * Funcion para observar los cambios en el formulario
   */
  listenFormChanges(): void {
    throw new Error('Method not implemented.');
  }

  /**
   * Funcion para probar la funcionalidad de los inputs select
   */
  doSomething() {

    // Mostramos el valor del formulario para ver el cambio
    console.log(this.componentForm.value);

  }

  /**
   * Funcion para hacer la prueba del input de OTP
   */
  requestToken() {

    // Indicamos que no se a solicitado el token
    this.tokenRequested = false;


    // Esperamos 1 segundo
    setTimeout(() => {

      // Indicamos que se solicito el token
      this.tokenRequested = true;

    }, 1000);

  }

  /**
   * Resete un control del form
   * @param controlName
   */
  resetControl(controlName: string, type: selectModes) {
    //* Cambia el tipo de modo
    this.selectMode = type

    //*Resetea el valor del input
    // this.componentForm.controls[controlName].reset()
  }

  /**
   * Funcion para ver el resultado del formulario
   */
  onSubmit(): void {

    //* Marco todos los inputs como touched porque así activan la validación de required
    this.componentForm.markAllAsTouched()

    //* Verifico si son válidos los inputs
    console.log(this.componentForm.valid);
    console.log(this.componentForm.controls);

  }

  ngOnDestroy(): void {
  }

  /**
   * Ejemplo de tryCatch
   */
  exampleTryCatch(): void {
    try {
      this.tryCatchError = false;
    } catch (error) {
      this.tryCatchError = true;
      this.tryCatchCode = 'MU-P-UL-001'; //Module-[InicialModule]-[Carpeta]-[InicialesComponente]-XXX. Ej: ModuleUsers-Pages-UsersList-001
    }
  }

}
