import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanyEditAsideComponent } from './company-edit-aside.component';






import { CompaniesFilterComponent } from '../companies-header/companies-filter/companies-filter.component';
import { NgxMaskModule } from 'ngx-mask';





@NgModule({
    declarations: [CompanyEditAsideComponent,


    ],
    imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    NgxMaskModule.forRoot()
],
    exports: [CompanyEditAsideComponent]


})
export class CompanyEditAsideModule { }
