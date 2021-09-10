import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailTempleteComponent } from './email-templete.component';




const routes: Routes = [{ path: '', component: EmailTempleteComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmailTempleteRoutingModule { }