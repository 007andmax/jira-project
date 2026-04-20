import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessesComponent } from './processes.component';
import { ProcessesRoutingModule } from './processes-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProcessesPipe } from 'src/app/pipe/processes.pipe';

@NgModule({
    imports: [
        CommonModule,
        ProcessesRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        ProcessesComponent,
        ProcessesPipe,
    ],
})
export class ProcessesModule { }
