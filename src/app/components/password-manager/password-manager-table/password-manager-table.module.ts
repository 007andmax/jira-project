import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordManagerTableComponent } from './password-manager-table.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { CompanyLogoPopoverModule } from 'src/app/directives/company-logo-popover/company-logo-popover.module';
import { UsersTableCompanyByModule } from '../../users/users-table/users-table-company-by/users-table-company-by.module';


@NgModule({
    declarations: [PasswordManagerTableComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        DynamicTooltipModule,
        CompanyLogoPopoverModule,
        UsersTableCompanyByModule
    ],
    exports: [PasswordManagerTableComponent]



})
export class PasswordManagerTableModule { }
