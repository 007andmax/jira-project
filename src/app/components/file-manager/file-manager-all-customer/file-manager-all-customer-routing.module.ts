import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FileManagerAllCustomerComponent } from './file-manager-all-customer.component';

const routes: Routes = [{ path: '', component: FileManagerAllCustomerComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FileManagementAllCustomerRoutingModule { }