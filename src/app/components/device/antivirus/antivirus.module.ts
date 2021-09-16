import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AntivirusComponent } from './antivirus.component';
import { AntivirusRoutingModule } from './antivirus-routing.module';


@NgModule({
    declarations: [AntivirusComponent
    ],
    imports: [
        CommonModule,
        AntivirusRoutingModule
    ],



})
export class AntivirusModule { }
