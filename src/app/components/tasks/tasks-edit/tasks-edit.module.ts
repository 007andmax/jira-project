import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { CompanyDropDownModule } from '../../shared/company-drop-down/company-drop-down.module';
import { DatePickerModule } from '../../shared/date-picker/date-picker.module';
import { MatErrorModule } from '../../shared/mat-error/mat-error.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { ServicesListModule } from '../../shared/services-list/services-list.module';
import { TasksDatePickerModule } from '../tasks-date-picker/tasks-date-picker.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UploadAreaProgressModule } from '../../shared/upload-area/upload-area-progress/upload-area-progress.module';
import { TasksAddAssignedUsersModule } from '../tasks-add/tasks-add-assigned-users/tasks-add-assigned-users.module';
import { TasksAddAssociateTicketsModule } from '../tasks-add/tasks-add-associate-tickets/tasks-add-associate-tickets.module';
import { TasksEditComponent } from './tasks-edit.component';

@NgModule({
    declarations: [TasksEditComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        MatErrorModule,
        CompanyDropDownModule,
        TasksAddAssignedUsersModule,
        ServicesListModule,
        DropDownModule,
        TasksDatePickerModule,
        DatePickerModule,
        PreloaderTicketModule,
        UploadAreaProgressModule,
        NgbModule,
        AngularEditorModule,
        TasksAddAssociateTicketsModule

    ],
    exports: [TasksEditComponent]
})
export class TasksEditModule { }
