import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { authTokenVariable, userLoggedVariable } from 'commun/src/app/data/constants/local-storage-variables';
import { CmmAlertModalModel } from 'commun/src/app/data/dialogs/models/dialogs.model';
import { spinner } from 'commun/src/app/data/utils/reducer/utils.selector';
import { CmmDataService } from 'commun/src/app/services/data.service';
import { CmmDialogService } from 'commun/src/app/services/dialogs.service';
import { CmmTimerSessionService } from 'commun/src/app/services/timer-session.service';
import { chinchinMenuIcon, chinchinUserIcon, chinchinWhiteLogo } from 'commun/src/assets/images/images-routes';
import { Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'pag-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.scss'],
})
export class BaseLayoutComponent implements OnInit {

  /**
   * Variable que finaliza las suscripciones una vez se destruye el componente
   */
  private unsubscribe = new Subject<void>();

  /**
   * Versión del proyecto
   */
  version: string = environment.CC_VERSION;

  /**
   * Variable que tiene la info del usuario logeado para usar en el menu
   */
  userBackoffice: any;

  /**
   * Variable que contiene la version del proyecto
   */
  projectVersion: string = environment.CC_VERSION;

  /**
   * IMAGENES
   */
  chinchinMenuIcon = chinchinMenuIcon;
  chinchinUserIcon = chinchinUserIcon;
  chinchinWhiteLogo = chinchinWhiteLogo;

  /**
   * Indica si está abierto el diálogo de sesión expirada
   */
  expiratedSessionDialogOpen: boolean = false

  /**
   * Altura del toolbar
   */
  toolbarHeight: number = 0

  /**
   * Altura del controlador de versión
   */
  versionControlHeight: number = 0

  /**
   * Variable que indica si se esta cargando algo
   */
  spinner: boolean = false;

  /**
   * Form para insertar token
   */
  tokenForm: FormControl = new FormControl('')

  constructor(
    public dataservice: CmmDataService,
    private store: Store,
    public dialogService: CmmDialogService,
    public dialog: MatDialog,
    public router: Router,
    private timerSessionService: CmmTimerSessionService
  ) {}

  //? Métodos de ciclo de vida

  ngOnInit(): void {

    // Saco la info del usuario desde el ls para usar en mi objeto
    this.userBackoffice = JSON.parse(localStorage.getItem(userLoggedVariable)!);

    // Ejecutamos la funcion para estar atentos del estado de la session
    this.listenSessionExpiration();

    // Ejecutamos la funcion para estar atentos del estado del spinner
    this.listenSpinnerChanges()

    //*Escucho los cambios para setear el nuevo token
    this.tokenForm.valueChanges.subscribe(value => {
      sessionStorage.setItem(authTokenVariable, value)
    })

  }

  ngAfterViewInit() {

    //* Obtengo la altura del toolbar
    this.toolbarHeight = document.getElementById('toolbar')?.offsetHeight as number;

    //* Obtengo la altura del controlador de versión
    this.versionControlHeight = document.getElementById('version_control')?.offsetHeight as number;

  }

  ngOnDestroy(){

    // Detengo todo los procesos que se esten ejecutando en este componente
    this.unsubscribe.next();

  }

  /**
   * Abre el diálogo para confirmar si se cierra la sesión o se mantiene
   */
  expiratedTimeDialog(){

    //*Si ya el diálogo está abierto, no lo vuelvo a abrir
    if(this.expiratedSessionDialogOpen){
      return
    }

    // Indico que se abrio el dialogo
    this.expiratedSessionDialogOpen = true;

    // Armamos la data de la alerta
    const messagesData : CmmAlertModalModel = {
      title: 'Su sesión está a punto de expirar',
      text: '',
      typeIcon:'warning',
      showCancelButton: true,
      cancelButtonText: 'Cerrar sesión',
      showConfirmButton: true,
      confirmButtonText: 'Mantener sesión',
      timeLeft: 30
    }

    // Abrimos la alerta con el mensaje
    this.dialogService.CmmOpenCloseSessionDialog( messagesData )
      .pipe(
        takeUntil(this.unsubscribe)
      )
      .subscribe(result => {

        // En caso que el usuario confirme
        if(result == 'confirm'){

          // Indicamos que se cerro el dialogo
          this.expiratedSessionDialogOpen = false;

        }

        // En caso de que el usuario no continuara
        else {

          // Indicamos que se cerro el dialogo
          this.expiratedSessionDialogOpen = false;

          // Ejecutamos la funcion para cerrar la session
          this.logout();

        }

      })
  }

  /**
   * Está pendiente de si la sesión expiró
   */
  listenSessionExpiration(){

    //*Si estoy en auth, este diálogo no debe aparecer
    if(this.router.url.includes('auth')){
      return
    }

    // Observo el estado de la session
    this.timerSessionService.sessionExpired
    .pipe(
      // Indicamos que esta funcion se ejecutara hasta que el indique lo contario
      takeUntil(this.unsubscribe)
    )
    .subscribe(expirated => {

      // Si la session esta expirada pero el usuario tiene un token
      if(expirated && sessionStorage.getItem(authTokenVariable)){

        // Ejecuto la funcion para verificar si quiere mantener la session
        this.expiratedTimeDialog();
      }

      // En cualquier otro caso
      else {

        // Cerramos todos los dialogos abiertos
        this.dialogService.CmmCloseAllDialogs();

      }

    });

  }

  /**
   * Escucha los cambios del spinner
   */
  listenSpinnerChanges() {

    // Observamos el estado del spinner en commun
    this.store.select(spinner)
    .pipe(
      // Indicamos que esta funcion se ejecutara hasta que el indique lo contario
      takeUntil(this.unsubscribe)
    )
    .subscribe({
      next: (data: any) => {

        // Activamos o no el spinner segun nos idique su estado
        this.spinner = data;

      }
    });

  }

  /**
   * Cierra la sesión
   */
  logout(){

    // Ejecuatamos el servicio de cierre de session
    this.timerSessionService.CmmCloseSession();

  }

}
