import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';
import { TasksAddAssignedUsersComponent } from './tasks-add-assigned-users.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    declarations: [TasksAddAssignedUsersComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        DropDownModule,
        MatFormFieldModule,
        MatChipListModule,
        DynamicTooltipModule,
        MatChipModule,
        NgbModule
    ],
    exports: [TasksAddAssignedUsersComponent]
})
export class TasksAddAssignedUsersModule { }
