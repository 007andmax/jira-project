import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TicketSettingsPageComponent } from './ticket-settings-page.component';


const routes: Routes = [{ path: '', component: TicketSettingsPageComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TicketSettingsPageRoutingModule { }