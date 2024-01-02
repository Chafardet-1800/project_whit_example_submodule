import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DepositService {
  /**
   * Variable que contiene la url del gateway
   */
  gatewayUrl: string;

  constructor(private http: HttpClient) {
    this.gatewayUrl = 'http://172.16.4.100:4001';
  }

  /**
   *
   * @param Api listado de depositos
   * @returns
   */
  getDepositsList(
    search: string,
    limit: string,
    page: string,
    startDate: string,
    endDate: string,
    amountStart: any,
    amountEnd: any,
    idDepositStatus: string,
    idDepositCurrency: string
  ): Observable<any> {
    let params = {
      limit,
      page,
    };

    // Validar no enviar parametros vacios
    if (startDate) {
      Object.assign(params, { startDate });
    }

    if (endDate) {
      Object.assign(params, { endDate });
    }

    if (amountStart) {
      Object.assign(params, { amountStart });
    }

    if (amountEnd) {
      Object.assign(params, { amountEnd });
    }

    if (search) {
      Object.assign(params, { search });
    }

    if (idDepositStatus) {
      Object.assign(params, { idDepositStatus });
    }

    if (idDepositCurrency) {
      Object.assign(params, { idDepositCurrency });
    }
    return this.http.get(this.gatewayUrl + '/v1/operation/deposits', {
      params,
    });
  }

  /**
   *
   * @param Api detalle de deposito
   * @returns
   */
  getDepositDetail(idDeposit: string): Observable<any> {
    let params = {
      idDeposit,
    };

    return this.http.get(this.gatewayUrl + '/v1/operation/deposit', {
      params,
    });
  }

  /**
   *
   * @param idDeposit Aprobar rechazar un deposito bancario
   * @param approved
   * @param reasonRejected
   * @returns
   */
  updateDeposit(
    idDeposit: string,
    approved: boolean,
    reasonRejected: string
  ): Observable<any> {
    let params = {
      idDeposit,
      approved,
    };

    if (reasonRejected) {
      Object.assign(params, { reasonRejected });
    }

    return this.http.put(this.gatewayUrl + '/v1/operation/deposit', params);
  }
}
