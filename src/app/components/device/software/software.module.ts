import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoftwareComponent } from './software.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { SoftwarePipe } from 'src/app/pipe/software.pipe';
import { SoftwareRoutingModule } from './software-routing.module';



@NgModule({
    declarations: [SoftwareComponent,
        SoftwarePipe

    ],
    imports: [
        CommonModule,
        FormsModule,
        DataTablesModule,
        SoftwareRoutingModule
    ],
    exports: [SoftwarePipe]


})
export class SoftwareModule { }
