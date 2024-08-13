import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FileManagementAllCustomerCompanyComponent } from './file-management-all-customer-company.component';

const routes: Routes = [{ path: '', component: FileManagementAllCustomerCompanyComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FileManagementAllCustomerCompanyRoutingModule { }