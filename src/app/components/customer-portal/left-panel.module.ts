import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RightClickBlankModule } from 'src/app/directives/right-click-blank/right-click-blank.module';
import { LeftPanelCustomerPortalUsersComponent } from './left-panel-customer-portal/left-panel-customer-portal-users/left-panel-customer-portal-users.component';
import { LeftPanelCustomerPortalComponent } from './left-panel-customer-portal/left-panel-customer-portal.component';
import { CustomerPortalDefaultComponent } from './customer-portal-default/customer-portal-default.component';

@NgModule({
    declarations: [LeftPanelCustomerPortalComponent,
        LeftPanelCustomerPortalUsersComponent

    ],
    imports: [
        CommonModule,
        RightClickBlankModule

    ],
    exports: [LeftPanelCustomerPortalComponent]

})
export class LeftPanelCustomerPortalModule { }
