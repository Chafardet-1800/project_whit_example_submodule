import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthLayoutComponent } from './pages/auth-layout/auth-layout.component';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { AuthLoginFormComponent } from './components/auth-login-form/auth-login-form.component';
import { CmmModule } from 'commun/src/app/commun.module';

@NgModule({
  declarations: [AuthLayoutComponent, AuthLoginFormComponent],
  imports: [CommonModule, AuthRoutingModule, CmmModule],
  providers: [AuthService],
})
export class AuthModule {}
