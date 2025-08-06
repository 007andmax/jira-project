import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NotificationsComponent } from './notifications.component';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    declarations: [NotificationsComponent
    ],
    imports: [
        CommonModule,
        InfiniteScrollModule,
        FormsModule,
        DisabledBtnModule,
        NgbModule
    ],
    exports: [NotificationsComponent]
})
export class NotificationsModule { }
