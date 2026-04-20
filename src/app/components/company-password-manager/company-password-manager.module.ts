import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyPasswordManagerComponent } from './company-password-manager.component';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';



import { CompanyPasswordManagerRoutingModule } from './company-password-manager-routing.module';
import { PasswoordManagerFiltersComponent } from '../password-manager/passwoord-manager-header/passwoord-manager-filters/passwoord-manager-filters.component';



@NgModule({
    imports: [
    CommonModule,
    InfiniteScrollModule,
    CompanyPasswordManagerRoutingModule,
    CompanyPasswordManagerComponent
],
})
export class CompanyPasswordManagerModule { }
