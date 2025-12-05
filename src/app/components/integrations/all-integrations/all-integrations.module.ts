import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllIntegrationsRoutingModule } from './all-integrations-routing.module';
import { AllIntegrationsComponent } from './all-integrations.component';

@NgModule({
    declarations: [AllIntegrationsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        AllIntegrationsRoutingModule,
        ReactiveFormsModule,

    ],

})
export class AllIntegrationsModule { }
