import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllIntegrationsRoutingModule } from './all-integrations-routing.module';
import { AllIntegrationsComponent } from './all-integrations.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AllIntegrationsOverviewComponent } from './all-integrations-overview/all-integrations-overview.component';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { MatErrorModule } from '../../shared/mat-error/mat-error.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';

@NgModule({
    declarations: [AllIntegrationsComponent, AllIntegrationsOverviewComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        AllIntegrationsRoutingModule,
        ReactiveFormsModule,
        NgbModule,
        MatErrorModule,
        DisabledBtnModule,
        PreloaderTicketModule
    ],

})
export class AllIntegrationsModule { }
