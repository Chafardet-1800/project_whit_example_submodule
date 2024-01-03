import { NgModule } from '@angular/core';
import { CmmSpinnerComponent } from './components/others/spinner/spinner.component';
import { CmmAlertMessagesComponent } from './components/dialogs/alert-messages/alert-messages.component';
import { CmmInputTextComponent } from './components/inputs/input-text/input-text.component';
import { CmmInputEmailComponent } from './components/inputs/input-email/input-email.component';
import { CmmInputSelectComponent } from './components/inputs/input-select/input-select.component';
import { CmmInputSmFileComponent } from './components/inputs/input-sm-file/input-sm-file.component';
import { CmmToastrComponent } from './components/dialogs/toastr/toastr.component';
import { CmmSelectionDialogComponent } from './components/dialogs/selection/selection-dialog.component';
import { CmmInputDateComponent } from './components/inputs/input-date/input-date.component';
import { CmmCoverComponent } from './components/covers/cover/cover.component';
import { CmmVersionControlComponent } from './components/others/version-control/version-control.component';
import { CmmTableMainComponent } from './components/tables/table-main/table-main.component';
import { CmmTableActionsComponent } from './components/tables/table-actions/table-actions.component';
import { CmmTableCoverComponent } from './components/tables/table-cover/table-cover.component';
import { CmmInputPasswordComponent } from './components/inputs/input-password/input-password.component';
import { CmmInputQuestionDialogComponent } from './components/dialogs/input-question-dialog/input-question-dialog.component';
import { CmmInputAmountComponent } from './components/inputs/input-amount/input-amount.component';
import { CmmAmountFormatDirective } from './directives/amount-format.directive';
import { CmmNumberFormatDirective } from './directives/number-format.directive';
import { CmmSafeUrlPipe } from './pipes/sanitize-url.pipe';
import { CmmOptionCardComponent } from './components/others/cmm-option-card/cmm-option-card.component';
import { CmmOptionsMenuComponent } from './components/others/cmm-options-menu/cmm-options-menu.component';
import { CmmSnackbarCenteredComponent } from './components/dialogs/snackbar-centered/snackbar-centered.component';
import { CmmInputOtpComponent } from './components/inputs/input-otp/input-otp.component';
import { CmmObjectList } from './pipes/object-list.pipe';
import { InputDocumentComponent } from './components/inputs/input-document/input-document.component';
import { CmmAmountFormatPipe } from './pipes/amount-format.pipe';
import { CmmSanitizeAmountFormatPipe } from './pipes/sanitize-amount.pipe';
import { CmmFooterComponent } from './components/others/footer/footer.component';
import { CmmButtonComponent } from './components/buttons/button/button.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CmmDataService } from './services/data.service';
import { CmmDialogService } from './services/dialogs.service';
import { CmmAuthGuard } from './guards/auth.guard';
import { MaterialModule } from './material.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
  declarations: [
    CmmSpinnerComponent,
    CmmAlertMessagesComponent,
    CmmInputTextComponent,
    CmmInputEmailComponent,
    CmmInputSelectComponent,
    CmmInputSmFileComponent,
    CmmToastrComponent,
    CmmSelectionDialogComponent,
    CmmInputDateComponent,
    CmmCoverComponent,
    CmmVersionControlComponent,
    CmmTableMainComponent,
    CmmTableActionsComponent,
    CmmTableCoverComponent,
    CmmInputPasswordComponent,
    CmmInputQuestionDialogComponent,
    CmmInputAmountComponent,
    CmmAmountFormatDirective,
    CmmNumberFormatDirective,
    CmmSafeUrlPipe,
    CmmOptionCardComponent,
    CmmOptionsMenuComponent,
    CmmSnackbarCenteredComponent,
    CmmInputOtpComponent,
    CmmObjectList,
    InputDocumentComponent,
    CmmAmountFormatPipe,
    CmmSanitizeAmountFormatPipe,
    CmmFooterComponent,
    CmmButtonComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    DatePipe,
    FormsModule,
  ],
  providers: [
    CmmDataService,
    CmmDialogService,
    CmmAuthGuard,
    DatePipe,
    CmmSafeUrlPipe,
    CmmObjectList,
    CmmAmountFormatPipe,
    CmmSanitizeAmountFormatPipe,
    { provide: MAT_DATE_LOCALE, useValue: 'es' }
  ],
  exports: [
    CmmSpinnerComponent,
    CmmAlertMessagesComponent,
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    CmmInputTextComponent,
    CmmInputEmailComponent,
    CmmInputSelectComponent,
    CmmInputSmFileComponent,
    CmmToastrComponent,
    CmmInputDateComponent,
    CmmInputPasswordComponent,
    CmmCoverComponent,
    CmmVersionControlComponent,
    CmmTableMainComponent,
    CmmInputQuestionDialogComponent,
    CmmInputAmountComponent,
    CmmAmountFormatDirective,
    CmmNumberFormatDirective,
    CmmSafeUrlPipe,
    CmmOptionCardComponent,
    CmmOptionsMenuComponent,
    CmmSnackbarCenteredComponent,
    CmmInputOtpComponent,
    CmmObjectList,
    CmmAmountFormatPipe,
    CmmSanitizeAmountFormatPipe,
    CmmFooterComponent,
    CmmButtonComponent,
    FormsModule
  ],
})
export class CmmModule { }
