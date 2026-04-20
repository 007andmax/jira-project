import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StartupComponent } from './startup-programes.component';
import { StartupRoutingModule } from './startup-programes-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StartUpProgramPipe } from 'src/app/pipe/startup-program.pipe';

@NgModule({
    imports: [
        CommonModule,
        StartupRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        StartupComponent,
        StartUpProgramPipe,
    ],
})
export class StartupModule { }
