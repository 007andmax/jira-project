import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportComponent } from './support.component';
import { SupportItemComponent } from './support-item/support-item.component';

import { SupportRoutingModule } from './support-routing.module';



@NgModule({
    imports: [
    CommonModule,
    SupportRoutingModule,
    SupportComponent,
    SupportItemComponent
],
})
export class SupportModule { }
