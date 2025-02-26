import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerminalComponent } from './terminal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TerminalRoutingModule } from './terminal-routing.module';


@NgModule({
    declarations: [TerminalComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        TerminalRoutingModule,
        ReactiveFormsModule
    ],



})
export class TerminalModule { }
