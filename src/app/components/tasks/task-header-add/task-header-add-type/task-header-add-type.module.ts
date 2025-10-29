import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TaskHeaderAddTypeComponent } from './task-header-add-type.component';


@NgModule({
    declarations: [TaskHeaderAddTypeComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
    ],
    exports: [TaskHeaderAddTypeComponent]
})
export class TaskHeaderAddTypeModule { }
