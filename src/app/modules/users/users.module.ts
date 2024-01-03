import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UsersFormComponent } from './components/users-form/users-form.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { UsersOptionsLayoutComponent } from './pages/users-options-layout/users-options-layout.component';
import { UsersRoutingModule } from './users-routing.module';
import { UserListLayoutComponent } from './pages/user-list-layout/user-list-layout.component';
import { UserFormLayoutComponent } from './pages/user-form-layout/user-form-layout.component';
import { CmmModule } from 'src/app/common/common.module';


@NgModule({
  declarations: [
    UsersListComponent,
    UsersFormComponent,
    UsersOptionsLayoutComponent,
    UserListLayoutComponent,
    UserFormLayoutComponent,
  ],
  imports: [
    CommonModule,
    CmmModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
