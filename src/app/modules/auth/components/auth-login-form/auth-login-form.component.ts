import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LoginModel } from '../../models/auth.model';
import { chinchinShapeLogo } from 'src/app/common/src/assets/images/images-routes';
import { CmmDialogService } from 'src/app/common/src/app/services/dialogs.service';
import { CmmDataService } from 'src/app/common/src/app/services/data.service';
import { authExpirationTime, userLoggedVariable } from 'src/app/common/src/app/data/constants/local-storage-variables';
import { CmmAlertToastrModel } from 'src/app/common/src/app/data/dialogs/models/dialogs.model';

@Component({
  selector: 'cmp-auth-login-form',
  templateUrl: './auth-login-form.component.html',
  styleUrls: ['./auth-login-form.component.scss'],
})
export class AuthLoginFormComponent {
  _unsubscribe = new Subject<void>();

  /**
   * Formulario
   */
  loginForm: FormGroup = new FormGroup([]);

  /**
   * Spinner
   */
  spinner: boolean = false;

  /**
   * IMAGENES
   */
  chinchinShapeLogo = chinchinShapeLogo;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private authService: AuthService,
    private cmmDialogsService: CmmDialogService,
    private dataservice: CmmDataService,
    public router: Router
  ) {}

  ngOnInit(): void {

    // Inicializo el formulario
    this.initializeForm();

  }

  /**
   * Funcion que inicializa el formulario
   */
  initializeForm() {

    // Creo el formulario con el constructor agregando los controles necesarios
    this.loginForm = this.formBuilder.group({
      username: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(1000),
        ]),
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(1000),
        ]),
      ],
    });

  }

  /**
   * Funcion que hace la peticion de login
   */
  onSubmit() {

    // Marcamos todos controles del formaularios como marcados para rezaltar los posibles errores
    this.loginForm.markAllAsTouched();

    // Si el formulario es invalido me detengo aqui
    if (this.loginForm.invalid) {
      return false;
    }

    // Activamos el spinner
    this.spinner = true;

    // Creo un objeto con los datos del formulario en el formato correcto para la peticion
    let loginValue: LoginModel = {
      userLogin: this.loginForm.value.username,
      userPassword: btoa(this.loginForm.value.password),
    };

    // Hacemos la peticion a la api
    this.authService.postLoginEndpoint(loginValue)
      .pipe(
        // Indicamos que esta funcion se ejecutara hasta que el indique lo contario
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (response) => {

          // Guardo en mi ls los datos del usuario logeado
          localStorage.setItem(userLoggedVariable, JSON.stringify(response.data));

          // Seteo el tiempo de expiración de la sesión
          sessionStorage.setItem(authExpirationTime, this.dataservice.CmmB64EncodeUnicode(String(Number(response.data.timeExpiration)/1000)));

          // Redirigo al dashboard (descomentar)
          this.router.navigate(['dashboard']);

          // Armamos el mensaje para la alerta en el formato correcto
          let toastrData: CmmAlertToastrModel = {
            typeIcon: 'success',
            text: response.message
          };

          // Accionamos la alerta con el mensaje preparado
          this.cmmDialogsService.CmmAlertToastr(toastrData);

        },
        error: (error) => {

          // Indicamos la detencion del spinner
          this.spinner = false;

        },
      });

    return;

  }

  ngOnDestroy() {

    // terminamos cualquier proceso que estuviera pendiente
    this._unsubscribe.next();
    this._unsubscribe.complete();

  }
}
