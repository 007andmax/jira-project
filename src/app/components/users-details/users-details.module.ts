import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UsersDetailsHeaderComponent } from './users-details-header/users-details-header.component';
import { UsersDetailsLeftPanelComponent } from './users-details-left-panel/users-details-left-panel.component';
import { UsersDetailsRoutingModule } from './users-details-routing.module';
import { UsersDetailsComponent } from './users-details.component';
import { DynamicTooltipModule } from '../shared/dynamic-tooltip/dynamic-tooltip.module';


@NgModule({
    declarations: [UsersDetailsComponent,
        UsersDetailsHeaderComponent,
        UsersDetailsLeftPanelComponent
    ],
    imports: [
        CommonModule,
        UsersDetailsRoutingModule,
        FormsModule,
        NgbModule,
        DynamicTooltipModule
    ],
})
export class UsersDetailsModule { }
