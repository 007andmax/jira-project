import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeftPanelComponent } from './left-panel.component';
import { LeftPanelSupportComponent } from './left-panel-support/left-panel-support.component';
import { LeftPanelTicketsComponent } from './left-panel-tickets/left-panel-tickets.component';
import { LeftPanelUsersComponent } from './left-panel-users/left-panel-users.component';
import { LeftPanelCompaniesComponent } from './left-panel-companies/left-panel-companies.component';
import { LeftPanelBillingComponent } from './left-panel-billing/left-panel-billing.component';
import { LeftPanelInventoryComponent } from './left-panel-inventory/left-panel-inventory.component';
import { LeftPanelPasswordManagerComponent } from './left-panel-password-manager/left-panel-password-manager.component';
import { LeftPanelDocumentsComponent } from './left-panel-documents/left-panel-documents.component';
import { LeftPanelReportsComponent } from './left-panel-reports/left-panel-reports.component';
import { LeftPanelSettingsComponent } from './left-panel-settings/left-panel-settings.component';
import { LeftPanelCompanyComponent } from './left-panel-company/left-panel-company.component';

@NgModule({
    declarations: [LeftPanelComponent,
        LeftPanelSupportComponent,
        LeftPanelTicketsComponent,
        LeftPanelUsersComponent,
        LeftPanelCompaniesComponent,
        LeftPanelBillingComponent,
        LeftPanelInventoryComponent,
        LeftPanelPasswordManagerComponent,
        LeftPanelDocumentsComponent,
        LeftPanelReportsComponent,
        LeftPanelSettingsComponent,
        LeftPanelCompanyComponent,

    ],
    imports: [
        CommonModule,

    ],
    exports: [LeftPanelComponent]

})
export class LeftPanelModule { }
