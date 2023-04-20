import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerPermissionsComponent } from './customer-permissions.component';
import { CustomerPermissionsRoutingModule } from './customer-permissions-routing.module';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { CustomerPermissionsAddComponent } from './customer-permissions-add/customer-permissions-add.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomerPermissionsEditComponent } from './customer-permissions-edit/customer-permissions-edit.component';

@NgModule({
    declarations: [CustomerPermissionsComponent, CustomerPermissionsAddComponent, CustomerPermissionsEditComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        CustomerPermissionsRoutingModule,
        DynamicTooltipModule,
        NgbModule,

    ],

})
export class CustomerPermissionsModule { }
