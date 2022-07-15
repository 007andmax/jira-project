import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicTooltipModule } from '../dynamic-tooltip/dynamic-tooltip.module';
import { TechUsersComponent } from './tech-users.component';



@NgModule({
    declarations: [TechUsersComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        DynamicTooltipModule
    ],
    exports: [TechUsersComponent]



})
export class TechUsersModule { }
