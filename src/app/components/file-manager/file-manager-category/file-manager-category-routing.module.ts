import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FileManagerCategoryComponent } from './file-manager-category.component';

const routes: Routes = [{ path: '', component: FileManagerCategoryComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FileManagementCategoryRoutingModule { }