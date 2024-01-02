import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersFormComponent } from './components/users-form/users-form.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { UsersOptionsLayoutComponent } from './pages/users-options-layout/users-options-layout.component';
import { UserListLayoutComponent } from './pages/user-list-layout/user-list-layout.component';
import { UserFormLayoutComponent } from './pages/user-form-layout/user-form-layout.component';

const routes: Routes = [
  {
    path: 'options',
    component: UsersOptionsLayoutComponent
  },
  {
    path: 'form',
    component: UserFormLayoutComponent
  },
  {
    path: 'list',
    component: UserListLayoutComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
