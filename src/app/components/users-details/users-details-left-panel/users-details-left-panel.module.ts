import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersDetailsLeftPanelComponent } from './users-details-left-panel.component';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { MatErrorModule } from '../../shared/mat-error/mat-error.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanyTagsModule } from '../../companies/company-tags/company-tags.module';
import { UserCustomSubscriptionModule } from '../../users/users-aside/user-custom-subscription/user-custom-subscription.module';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [UsersDetailsLeftPanelComponent],
  imports: [
    CommonModule,
    DynamicTooltipModule,
    MatErrorModule,
    FormsModule,
    NgbModule,
    CompanyTagsModule,
    ReactiveFormsModule,
    UserCustomSubscriptionModule,
    NgxMaskModule.forRoot(),
  ],
  exports: [UsersDetailsLeftPanelComponent]
})
export class UsersDetailsLeftPanelModule { }
