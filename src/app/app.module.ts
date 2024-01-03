import { metaReducers } from './core/reducer/index';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { CmmDataService } from 'src/app/common/src/app/services/data.service';
import { CmmTimerSessionService } from 'src/app/common/src/app/services/timer-session.service';
import { CmmDialogService } from 'src/app/common/src/app/services/dialogs.service';
import { CmmAuthGuard } from 'src/app/common/src/app/guards/auth.guard';
import { CmmHttpInterceptor } from 'src/app/common/src/app/interceptors/http.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { reducers } from 'src/app/core/reducer';
import { CmmModule } from 'src/app/common/src/app/common.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    CmmModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([]),
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      },
    })
  ],
  providers: [
    CmmDataService,
    CmmTimerSessionService,
    CmmDialogService,
    CmmAuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CmmHttpInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [],
})
export class AppModule { }
