import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuperAdminKnowledgeBaseComponent } from './super-admin-knowledge-base.component';

const routes: Routes = [{ path: '', component: SuperAdminKnowledgeBaseComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SuperAdminKnowledgeBaseRoutingModule { }