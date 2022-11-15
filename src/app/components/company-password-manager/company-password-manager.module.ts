import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyPasswordManagerComponent } from './company-password-manager.component';
import { PasswoordManagerHeaderModule } from '../password-manager/passwoord-manager-header/passwoord-manager-header.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PasswordManagerTableModule } from '../password-manager/password-manager-table/password-manager-table.module';
import { PasswordManagerEditAsideModule } from '../password-manager/password-manager-edit-aside/password-manager-edit-aside.module';
import { PasswordManagerAddAsideModule } from '../password-manager/password-manager-add-aside/password-manager-add-aside.module';
import { CompanyPasswordManagerRoutingModule } from './company-password-manager-routing.module';


@NgModule({
    declarations: [CompanyPasswordManagerComponent
    ],
    imports: [
        CommonModule,
        PasswoordManagerHeaderModule,
        InfiniteScrollModule,
        PasswordManagerTableModule,
        PasswordManagerEditAsideModule,
        PasswordManagerAddAsideModule,
        CompanyPasswordManagerRoutingModule
    ],



})
export class CompanyPasswordManagerModule { }
