import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserFilterSaveComponent } from './user-filter-save.component';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { MatErrorModule } from '../../shared/mat-error/mat-error.module';

@NgModule({
    declarations: [UserFilterSaveComponent,

    ],
    imports: [
        CommonModule,
        FormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        DynamicTooltipModule,
        MatErrorModule
    ],
    exports: [UserFilterSaveComponent],
    entryComponents: [UserFilterSaveComponent]


})
export class UserFilterSaveModule { }
