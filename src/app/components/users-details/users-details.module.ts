import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UsersDetailsHeaderComponent } from './users-details-header/users-details-header.component';
import { UsersDetailsLeftPanelComponent } from './users-details-left-panel/users-details-left-panel.component';
import { UsersDetailsRoutingModule } from './users-details-routing.module';
import { UsersDetailsComponent } from './users-details.component';
import { DynamicTooltipModule } from '../shared/dynamic-tooltip/dynamic-tooltip.module';
import { MatErrorModule } from '../shared/mat-error/mat-error.module';
import { NgxMaskModule } from 'ngx-mask';
import { UserCustomSubscriptionModule } from '../users/users-aside/user-custom-subscription/user-custom-subscription.module';
import { CompanyTagsModule } from '../companies/company-tags/company-tags.module';


@NgModule({
    declarations: [UsersDetailsComponent,
        UsersDetailsHeaderComponent,
        UsersDetailsLeftPanelComponent,
    ],
    imports: [
        CommonModule,
        UsersDetailsRoutingModule,
        FormsModule,
        NgbModule,
        DynamicTooltipModule,
        NgxMaskModule.forRoot(),
        MatErrorModule,
        UserCustomSubscriptionModule,
        CompanyTagsModule,
        ReactiveFormsModule,
    ],
})
export class UsersDetailsModule { }
