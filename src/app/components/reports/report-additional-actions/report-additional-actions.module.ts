import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportAdditionalActionsComponent } from './report-additional-actions.component';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { ReportSendEmailComponent } from './report-send-email/report-send-email.component';
import { DraftEmailUserRecipientsModule } from '../../shared/draft-email/draft-email-user-recipients/draft-email-user-recipients.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FormsModule } from '@angular/forms';
import { ReportSendEmailModule } from './report-send-email/report-send-email.module';


@NgModule({
    declarations: [ReportAdditionalActionsComponent,
    ],
    imports: [
        CommonModule,
        DropDownModule,
        NgbModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        DraftEmailUserRecipientsModule,
        AngularEditorModule,
        FormsModule
    ],
    exports: [ReportAdditionalActionsComponent]
})
export class ReportAdditionalActionsModule { }
