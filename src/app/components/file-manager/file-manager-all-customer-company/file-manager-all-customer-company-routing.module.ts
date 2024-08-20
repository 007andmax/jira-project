import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FileManagerAllCustomerCompanyComponent } from './file-manager-all-customer-company.component';

const routes: Routes = [{ path: '', component: FileManagerAllCustomerCompanyComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FileManagementAllCustomerCompanyRoutingModule { }