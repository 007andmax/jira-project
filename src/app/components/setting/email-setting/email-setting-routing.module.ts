import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailSettingComponent } from './email-setting.component';




const routes: Routes = [{ path: '', component: EmailSettingComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmailSettingRoutingModule { }