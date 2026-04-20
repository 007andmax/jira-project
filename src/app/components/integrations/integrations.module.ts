import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IntegrationsRoutingModule } from './integrations-routing.module';
import { IntegrationsComponent } from './integrations.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IntegrationsRoutingModule,
        ReactiveFormsModule,
        IntegrationsComponent,
    ],
})
export class IntegrationsModule { }
