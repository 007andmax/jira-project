import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileManagerAllCustomerComponent } from './file-manager-all-customer.component';
import { FileManagementAllCustomerRoutingModule } from './file-manager-all-customer-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';











@NgModule({
    imports: [
    CommonModule,
    FileManagementAllCustomerRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    FileManagerAllCustomerComponent
],
})
export class FileManagementAllCustomerModule { }
