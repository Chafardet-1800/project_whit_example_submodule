import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestFormComponent } from './pages/test-form/test-form.component';
import { TestListComponent } from './pages/test-list/test-list.component';
import { TestRoomLayoutComponent } from './pages/test-room-layout/test-room-layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'room',
    pathMatch: 'full',
  },
  {
    path: 'list',
    data: {},
    component: TestListComponent,
  },
  {
    path: 'form',
    data: {},
    component: TestFormComponent,
  },
  {
    path: 'room',
    component: TestRoomLayoutComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestRoutingModule {}
