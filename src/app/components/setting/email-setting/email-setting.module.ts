import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailSettingComponent } from './email-setting.component';
import { IncomingEmailComponent } from './incoming-email/incoming-email.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OutgoingEmailComponent } from './outgoing-email/outgoing-email.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmailSettingRoutingModule } from './email-setting-routing.module';





@NgModule({
    imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    EmailSettingRoutingModule,
    EmailSettingComponent,
    IncomingEmailComponent,
    OutgoingEmailComponent
],
})
export class EmailSettingModule { }
