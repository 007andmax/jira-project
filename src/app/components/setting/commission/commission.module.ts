import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommissionComponent } from './commission.component';
import { CompanyComponent } from './company/company.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductComponent } from './product/product.component';
import { ContractComponent } from './contract/contract.component';
import { ServiceComponent } from './service/service.component';
import { CommissionRoutingModule } from './commission-routing.module';
import { TechUsersModule } from '../../shared/tech-users/tech-users.module';
import { CompanyTechUsersComponent } from './company/company-tech-users/company-tech-users.component';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { UserLogoPopoverModule } from 'src/app/directives/user-logo-popover/user-logo-popover.module';
import { TicketsTableItemRequestedByModule } from '../../tickets/tickets/tickets-table/tickets-table-item/tickets-table-item-requested-by/tickets-table-item-requested-by.module';


@NgModule({
    declarations: [CommissionComponent,
        CompanyComponent,
        ProductComponent,
        ContractComponent,
        ServiceComponent,
        CompanyTechUsersComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        TechUsersModule,
        CommissionRoutingModule,
        DynamicTooltipModule,
        TicketsTableItemRequestedByModule,
        UserLogoPopoverModule,
    ],



})
export class CommissionModule { }
