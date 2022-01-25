import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarketingEmailComponent } from './marketing-email.component';

const routes: Routes = [{ path: '', component: MarketingEmailComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MarketingEmailRoutingModule { }