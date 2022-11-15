import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountingSettingsComponent } from './accounting-settings.component';


const routes: Routes = [{ path: '', component: AccountingSettingsComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountingSettingsRoutingModule { }