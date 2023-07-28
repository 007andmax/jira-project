import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerPortalDefaultComponent } from './customer-portal-default.component';
import { CustomerPortalDefaultRoutingModule } from './customer-portal-default-routing.module';

@NgModule({
    declarations: [CustomerPortalDefaultComponent

    ],
    imports: [
        CommonModule,
        CustomerPortalDefaultRoutingModule

    ],

})
export class CustomerPortalDefaultModule { }
