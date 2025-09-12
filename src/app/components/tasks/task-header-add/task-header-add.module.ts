import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { TechUsersModule } from 'src/app/components/shared/tech-users/tech-users.module';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { TaskHeaderAddComponent } from './task-header-add.component';
import { TaskHeaderAddTypeComponent } from './task-header-add-type/task-header-add-type.component';
import { MultiDatepickerModule } from '../../shared/multi-datepicker/multi-datepicker.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';


@NgModule({
    declarations: [TaskHeaderAddComponent, TaskHeaderAddTypeComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        DropDownModule,
        TechUsersModule,
        DatePickerModule,
        MultiDatepickerModule,
        ReactiveFormsModule,
        NgbModule,
        DisabledBtnModule,
        PreloaderTicketModule,
    ],
    exports: [TaskHeaderAddComponent]
})
export class TaskHeaderAddModule { }
