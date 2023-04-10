import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerminalComponent } from './terminal.component';
import { TerminalRoutingOldModule } from './terminal-routing.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TerminalAsideComponent } from './terminal-aside/terminal-aside.component';
import { TerminalManageCategoryComponent } from './terminal-manage-category/terminal-manage-category.component';


@NgModule({
    declarations: [TerminalComponent, TerminalAsideComponent, TerminalManageCategoryComponent,

    ],
    imports: [
        CommonModule,
        FormsModule,
        TerminalRoutingOldModule,
        NgbModule,
    ],
    entryComponents: [TerminalManageCategoryComponent]
})
export class TerminalOldModule { }
