import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentsTemplatesComponent } from './documents-templates.component';


const routes: Routes = [{ path: '', component: DocumentsTemplatesComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DocumentsTemplatesRoutingModule { }