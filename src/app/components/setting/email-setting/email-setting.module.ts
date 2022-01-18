import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailSettingComponent } from './email-setting.component';
import { IncomingEmailComponent } from './incoming-email/incoming-email.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OutgoingEmailComponent } from './outgoing-email/outgoing-email.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmailSettingRoutingModule } from './email-setting-routing.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';




@NgModule({
    declarations: [EmailSettingComponent,
        IncomingEmailComponent,
        OutgoingEmailComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        EmailSettingRoutingModule,
        DisabledBtnModule,
        PreloaderTicketModule
    ],



})
export class EmailSettingModule { }
