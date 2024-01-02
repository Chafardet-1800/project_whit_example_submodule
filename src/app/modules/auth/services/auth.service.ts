import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginModel } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  /**
   * Variable que contiene la url del gateway
   */
  gatewayUrl: string;

  constructor(private http: HttpClient) {

    // Seteamos el la url base
    this.gatewayUrl = environment.CC_GATEWAY_URL;

  }

  /**
   * Servicio para hacer login en la pagina
   * @param formLogin Datos del usuarios necesarios apra el login
   * @returns
   */
  postLoginEndpoint(formLogin: LoginModel): Observable<any> {

    return this.http.post(this.gatewayUrl + '/v1/auth/login', formLogin);

  }

}
