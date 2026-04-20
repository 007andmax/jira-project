import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';







import { FileManagerAllCustomerCompanyComponent } from './file-manager-all-customer-company.component';
import { FileManagementAllCustomerCompanyRoutingModule } from './file-manager-all-customer-company-routing.module';





@NgModule({
    imports: [
    CommonModule,
    FileManagementAllCustomerCompanyRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    FileManagerAllCustomerCompanyComponent
],
})
export class FileManagementAllCustomerCompanyModule { }
