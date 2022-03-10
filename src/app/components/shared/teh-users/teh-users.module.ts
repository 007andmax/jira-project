import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TehUsersComponent } from './teh-users.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicTooltipModule } from '../dynamic-tooltip/dynamic-tooltip.module';



@NgModule({
    declarations: [TehUsersComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        DynamicTooltipModule
    ],
    exports: [TehUsersComponent]



})
export class TehUsersModule { }
