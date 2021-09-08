import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentsEditComponent } from './documents-edit.component';




const routes: Routes = [{ path: '', component: DocumentsEditComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DocumentsEditRoutingModule { }