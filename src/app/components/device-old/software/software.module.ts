import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoftwareComponent } from './software.component';
import { SoftwareRoutingOldModule } from './software-routing.module';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';

import { SoftwarePipe } from '../_pipe/software.pipe';
import { SoftwareHeaderComponent } from './software-header/software-header.component';



@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    DataTablesModule,
    SoftwareRoutingOldModule,
    SoftwareComponent,
    SoftwarePipe,
    SoftwareHeaderComponent
],
})
export class SoftwareOldModule { }
