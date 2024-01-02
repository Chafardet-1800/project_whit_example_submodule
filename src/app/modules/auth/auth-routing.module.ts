import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './pages/auth-layout/auth-layout.component';
import { AuthLoginFormComponent } from './components/auth-login-form/auth-login-form.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: AuthLoginFormComponent,
      },
      {
        path: '**',
        redirectTo: 'login/',
        pathMatch: 'full'
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [
    // CmmAuthGuard
  ],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
