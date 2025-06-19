import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerminalComponent } from './terminal.component';
import { TerminalRoutingOldModule } from './terminal-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TerminalAsideComponent } from './terminal-aside/terminal-aside.component';
import { TerminalManageCategoryComponent } from './terminal-manage-category/terminal-manage-category.component';
import { TerminalRunScriptComponent } from './terminal-run-script/terminal-run-script.component';
import { TerminalScriptDetailComponent } from './terminal-script-detail/terminal-script-detail.component';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';


@NgModule({
    declarations: [TerminalComponent, TerminalAsideComponent, TerminalManageCategoryComponent, TerminalRunScriptComponent, TerminalScriptDetailComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TerminalRoutingOldModule,
        NgbModule,
        DropDownModule
    ]
})
export class TerminalOldModule { }
