import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks.component';
import { TasksRoutingModule } from './tasks-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TasksHeaderComponent } from './tasks-header/tasks-header.component';
import { TasksAddComponent } from './tasks-add/tasks-add.component';
import { TasksAddAssignedUsersComponent } from './tasks-add/tasks-add-assigned-users/tasks-add-assigned-users.component';
import { MatErrorModule } from '../shared/mat-error/mat-error.module';
import { DropDownModule } from '../shared/drop-down/drop-down.module';
import { CompanyDropDownModule } from '../shared/company-drop-down/company-drop-down.module';
import { ServicesListModule } from '../shared/services-list/services-list.module';
import { MultiDatepickerModule } from '../shared/multi-datepicker/multi-datepicker.module';
import { DatePickerModule } from '../shared/date-picker/date-picker.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicTooltipModule } from '../shared/dynamic-tooltip/dynamic-tooltip.module';
import { MatChipListModule } from '../shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from '../shared/mat-chip/mat-chip.module';
import { MatFormFieldModule } from '../shared/mat-form-field/mat-form-field.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../shared/preloader-ticket/preloader-ticket.module';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
    declarations: [TasksComponent, TasksHeaderComponent, TasksAddComponent, TasksAddAssignedUsersComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        TasksRoutingModule,
        ReactiveFormsModule,
        MatErrorModule,
        DropDownModule,
        CompanyDropDownModule,
        ServicesListModule,
        MultiDatepickerModule,
        DatePickerModule,
        NgbModule,
        MatFormFieldModule,
        MatChipListModule,
        DynamicTooltipModule,
        MatChipModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        AngularEditorModule
    ],

})
export class TasksModule { }
