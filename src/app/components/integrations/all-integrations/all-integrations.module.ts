import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllIntegrationsRoutingModule } from './all-integrations-routing.module';
import { AllIntegrationsComponent } from './all-integrations.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AllIntegrationsOverviewComponent } from './all-integrations-overview/all-integrations-overview.component';




@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    AllIntegrationsRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    AllIntegrationsComponent, AllIntegrationsOverviewComponent
],
})
export class AllIntegrationsModule { }
