import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyFileManagerComponent } from './company-file-manager.component';



const routes: Routes = [{ path: '', component: CompanyFileManagerComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyFileManagerRoutingModule { }