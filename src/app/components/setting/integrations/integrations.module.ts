import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntegrationsComponent } from './integrations.component';
import { FormsModule } from '@angular/forms';
import { IntegrationsRoutingModule } from './integrations-routing.module';


@NgModule({
    declarations: [IntegrationsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        IntegrationsRoutingModule
    ],



})
export class IntegrationsModule { }
