import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { TechUsersModule } from 'src/app/components/shared/tech-users/tech-users.module';
import { TasksListItemComponent } from './tasks-list-item.component';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TasksDatePickerModule } from '../../tasks-date-picker/tasks-date-picker.module';


@NgModule({
    declarations: [TasksListItemComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        DropDownModule,
        TechUsersModule,
        DatePickerModule,
        NgbModule,
        TasksDatePickerModule
    ],
    exports: [TasksListItemComponent]
})
export class TasksListItemModule { }
