import { NgModule } from '@angular/core';

import { BaseRoutingModule } from './base.routing.module';
import { BaseLayoutComponent } from './pages/base-layout.component';
import { CommonModule } from '@angular/common';
import { CmmModule } from 'src/app/common/src/app/common.module';

@NgModule({
  declarations: [BaseLayoutComponent],
  imports: [
    CommonModule,
    BaseRoutingModule,
    CmmModule
  ],
  exports: [
  ]
})
export class BaseModule {}
