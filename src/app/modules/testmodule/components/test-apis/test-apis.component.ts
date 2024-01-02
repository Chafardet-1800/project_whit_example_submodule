import { Component } from '@angular/core';
import { PasarelaService } from '../../services/pasarela.service';
import { DepositService } from '../../services/deposit.service';

@Component({
  selector: 'cmp-test-apis',
  templateUrl: './test-apis.component.html',
  styleUrls: ['./test-apis.component.scss']
})
export class TestApisComponent {

  constructor(
    private pasarelaService: PasarelaService,
    private depositService: DepositService
  ) {}

  /**
   * Llama varias APIs al mismo tiempo
   */
  testSimultaneousCalls() {
    //* Llamo varias veces la misma api

    this.getOrder()
    this.getOrder()
    this.getOrder()

    setTimeout(() => {
      this.getOrder()
    }, 1000);

  }

  getOrder() {
    this.pasarelaService.getOrders().subscribe()
  }


}
