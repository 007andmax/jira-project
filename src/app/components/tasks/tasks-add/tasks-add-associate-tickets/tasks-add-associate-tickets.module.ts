import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TasksAddAssociateTicketsComponent } from './tasks-add-associate-tickets.component';


@NgModule({
    declarations: [TasksAddAssociateTicketsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        DropDownModule,
        InfiniteScrollModule,
        DynamicTooltipModule,
        NgbModule
    ],
    exports: [TasksAddAssociateTicketsComponent]
})
export class TasksAddAssociateTicketsModule { }
