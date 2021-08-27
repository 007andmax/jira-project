import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule, MatIconModule, MatSelectModule } from '@angular/material';
import { ContractsAsideUserDeviceServiceComponent } from './contracts-aside-user-device-service.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
    declarations: [ContractsAsideUserDeviceServiceComponent
    ],
    imports: [
        CommonModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        FormsModule,
        NgbModule
    ],
    exports: [ContractsAsideUserDeviceServiceComponent]


})
export class ContractsAsideUserDeviceServiceModule { }
