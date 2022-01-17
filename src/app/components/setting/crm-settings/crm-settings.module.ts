import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CrmSettingsComponent } from './crm-settings.component';
import { CrmSettingsRoutingModule } from './crm-settings-routing.module';



@NgModule({
    declarations: [
        CrmSettingsComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        CrmSettingsRoutingModule
    ],



})
export class CrmSettingsModule { }
