import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentsAddComponent } from './documents-add.component';



const routes: Routes = [{ path: '', component: DocumentsAddComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DocumentsAddRoutingModule { }