import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyDocumentsComponent } from './company-documents.component';




const routes: Routes = [{ path: '', component: CompanyDocumentsComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyDocumentsRoutingModule { }