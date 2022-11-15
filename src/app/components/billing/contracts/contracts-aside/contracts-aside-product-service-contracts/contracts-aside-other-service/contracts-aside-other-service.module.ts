import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractsAsideOtherServiceComponent } from './contracts-aside-other-service.component';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MatChipsModule, MatSelectModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { TicketProfileUpdatesServiceDurationModule } from 'src/app/components/tickets/tickets/ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service-duration/ticket-profile-updates-service-duration.module';



@NgModule({
    declarations: [ContractsAsideOtherServiceComponent
    ],
    imports: [
        CommonModule,
        DropDownModule,
        MatSelectModule,
        MatChipsModule,
        FormsModule,
        TicketProfileUpdatesServiceDurationModule,
        DatePickerModule
    ],
    exports: [ContractsAsideOtherServiceComponent]


})
export class ContractsAsideOtherServiceModule { }
