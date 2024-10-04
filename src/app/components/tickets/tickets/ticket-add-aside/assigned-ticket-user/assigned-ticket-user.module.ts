import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { AssignedTicketUserComponent } from './assigned-ticket-user.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AssignedTicketUserSelectedItemComponent } from './assigned-ticket-user-selected-item/assigned-ticket-user-selected-item.component';
import { AssignedTicketUserItemComponent } from './assigned-ticket-user-item/assigned-ticket-user-item.component';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';


@NgModule({
    declarations: [AssignedTicketUserComponent,
        AssignedTicketUserSelectedItemComponent,
        AssignedTicketUserItemComponent
    ],
    imports: [
        CommonModule,
        MatFormFieldModule,
        FormsModule,
        DropDownModule,
        NgbModule,
        DynamicTooltipModule,
        MatErrorModule
    ],
    exports: [AssignedTicketUserComponent]
})
export class AssignedTicketUserModule { }
