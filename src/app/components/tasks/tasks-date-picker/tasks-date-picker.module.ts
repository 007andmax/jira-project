import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TasksDatePickerComponent } from './tasks-date-picker.component';
import { MatErrorModule } from '../../shared/mat-error/mat-error.module';
import { ClickOutsideModule } from 'src/app/directives/click-otside/click-otside.module';
import { TicketProfileUpdatesServiceTimepickerModule } from '../../tickets/tickets/ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service-timepicker/ticket-profile-updates-service-timepicker.module';


@NgModule({
    declarations: [TasksDatePickerComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgbModule,
        MatErrorModule,
        FormsModule,
        TicketProfileUpdatesServiceTimepickerModule,
        ClickOutsideModule
    ],
    exports: [TasksDatePickerComponent]
})
export class TasksDatePickerModule { }
