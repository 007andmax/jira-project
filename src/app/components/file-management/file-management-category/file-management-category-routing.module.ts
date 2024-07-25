import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FileManagementCategoryComponent } from './file-management-category.component';

const routes: Routes = [{ path: '', component: FileManagementCategoryComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FileManagementCategoryRoutingModule { }