import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PasswordManagerComponent } from './password-manager.component';



const routes: Routes = [{ path: '', component: PasswordManagerComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PasswordManagerRoutingModule { }