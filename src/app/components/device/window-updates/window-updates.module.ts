import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WindowUpdatesComponent } from './window-updates.component';
import { WindowUpdatesRoutingModule } from './window-updates-routing.module';


@NgModule({
    declarations: [WindowUpdatesComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        WindowUpdatesRoutingModule
    ],
})
export class WindowUpdatesModule { }
