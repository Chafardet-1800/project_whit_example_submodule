import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CmmTimerSessionService } from '../../../services/timer-session.service';
import { CmmEnvironmentNames } from '../../../data/constants/general-variables';
// import { environment } from 'src/environments/environment';

@Component({
  selector: 'cmm-cmp-version-control',
  templateUrl: './version-control.component.html',
  styleUrls: ['./version-control.component.scss'],
})
export class CmmVersionControlComponent implements OnInit {

  /**
   * Variable con el nombre del ambiente
   */
  env: CmmEnvironmentNames = environment.CC_ENV_NAME as CmmEnvironmentNames;

  /**
   * Variable con la version del proyecto
   */
  version: string = environment.CC_VERSION;

  /**
   * Indica si está activo el modo mockup de las APIs
   */
  mockupModeActive: boolean = false

  /**
   * Clase para el background
   */
  bgClass: string  = ''

  constructor(
    public timerSession: CmmTimerSessionService
  ) {}

  ngOnInit() {

    //* Obtengo la clase para el ambiente en el que nos encontramos
    this.getEnvironment()

  }

  /**
   * Activa/desactiva el modo mockup de las APIs
   */
  toggleMockupMode() {

    this.mockupModeActive = !this.mockupModeActive

  }

  /**
   * Indica en qué ambiente estamos
   */
  getEnvironment() {

    switch (this.env) {
      case 'Developer':
        this.bgClass = 'cc-bg-environmentDev'
        break;
      case 'Quality':
        this.bgClass = 'cc-bg-environmentQA'
        break;
      case 'Sandbox':
        this.bgClass = 'cc-bg-environmentSandbox'
        break;
      case 'Production':
        this.bgClass = 'd-none'
        break;
      case 'Environment':
        this.bgClass = 'ccng-bgdefault'
        break;
      case 'Pre-production':
        this.bgClass = 'cc-bg-environmentPreProd'
        break;

      default:
        this.bgClass = 'd-none'
        break;
    }

  }

}
