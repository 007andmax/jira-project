import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentsCategoryComponent } from './documents-category.component';



const routes: Routes = [{ path: '', component: DocumentsCategoryComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DocumentsCategoryRoutingModule { }