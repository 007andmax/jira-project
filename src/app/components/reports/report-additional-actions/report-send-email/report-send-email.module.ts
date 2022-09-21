import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DraftEmailUserRecipientsModule } from 'src/app/components/shared/draft-email/draft-email-user-recipients/draft-email-user-recipients.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { ReportSendEmailComponent } from './report-send-email.component';
import { MatChipsModule, MatSelectModule } from '@angular/material';



@NgModule({
    declarations: [ReportSendEmailComponent],
    imports: [
        CommonModule,
        DropDownModule,
        NgbModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        DraftEmailUserRecipientsModule,
        AngularEditorModule,
        FormsModule,
        MatSelectModule,
        MatChipsModule,
    ],
    exports: [ReportSendEmailComponent]
})
export class ReportSendEmailModule { }
