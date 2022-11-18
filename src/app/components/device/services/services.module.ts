import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesComponent } from './services.component';
import { ServicesRoutingModule } from './services-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeviceServicePipe } from 'src/app/pipe/device-service.pipe';



@NgModule({
    declarations: [ServicesComponent,
        DeviceServicePipe
    ],
    imports: [
        CommonModule,
        ServicesRoutingModule,
        FormsModule,
        ReactiveFormsModule,
    ],



})
export class ServicesModule { }
