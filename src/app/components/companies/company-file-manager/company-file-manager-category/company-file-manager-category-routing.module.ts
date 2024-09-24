import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyFileManagerCategoryComponent } from './company-file-manager-category.component';

const routes: Routes = [{ path: '', component: CompanyFileManagerCategoryComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyFileManagerCategoryRoutingModule { }