import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AntivirusComponent } from './antivirus.component';



const routes: Routes = [{ path: '', component: AntivirusComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AntivirusRoutingModule { }