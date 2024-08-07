import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FileManagementAllCustomerComponent } from './file-management-all-customer.component';

const routes: Routes = [{ path: '', component: FileManagementAllCustomerComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FileManagementAllCustomerRoutingModule { }