import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TestFormComponent } from './pages/test-form/test-form.component';
import { TestListComponent } from './pages/test-list/test-list.component';
import { TestRoutingModule } from './test-routing.module';
import { TestRoomLayoutComponent } from './pages/test-room-layout/test-room-layout.component';
import { TestInputsComponent } from './components/test-inputs/test-inputs.component';
import { TestDialogsComponent } from './components/test-dialogs/test-dialogs.component';
import { TestApisComponent } from './components/test-apis/test-apis.component';
import { CmmModule } from 'src/app/commun/src/app/commun.module';

@NgModule({
  declarations: [
    TestFormComponent,
    TestListComponent,
    TestRoomLayoutComponent,
    TestInputsComponent,
    TestDialogsComponent,
    TestApisComponent,
  ],
  imports: [
    CommonModule,
    TestRoutingModule,
    CmmModule
  ],
})
export class TestModule {}
