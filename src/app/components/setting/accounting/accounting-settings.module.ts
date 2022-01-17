import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountingSettingsComponent } from './accounting-settings.component';
import { AccountingSettingsRoutingModule } from './accounting-settings-routing.module';



@NgModule({
    declarations: [
        AccountingSettingsComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        AccountingSettingsRoutingModule
    ],



})
export class AccoutingSettingsModule { }
