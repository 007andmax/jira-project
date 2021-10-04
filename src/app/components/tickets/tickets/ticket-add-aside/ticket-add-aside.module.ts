import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketAddAsideComponent } from './ticket-add-aside.component';
import { MatFormFieldModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { SelectSearchModule } from 'src/app/components/shared/select-search/select-search.module';
import { UploadAreaComponent } from 'src/app/components/shared/upload-area/upload-area.component';
import { TehUsersModule } from 'src/app/components/shared/teh-users/teh-users.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { UploadAreaProgressComponent } from 'src/app/components/shared/upload-area/upload-area-progress/upload-area-progress.component';
import { UploadAreaProgressModule } from 'src/app/components/shared/upload-area/upload-area-progress/upload-area-progress.module';
import { DndDirective } from 'src/app/directives/dnd.directive';



@NgModule({
    declarations: [TicketAddAsideComponent,
        UploadAreaComponent,
        DndDirective

    ],
    imports: [
        CommonModule,
        MatFormFieldModule,
        FormsModule,
        DropDownModule,
        SelectSearchModule,
        TehUsersModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        UploadAreaProgressModule
    ],
    exports: [TicketAddAsideComponent]
})
export class TicketAddAsideModule { }
