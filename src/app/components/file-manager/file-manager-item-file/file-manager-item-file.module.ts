import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { FileManagerItemFileComponent } from './file-manager-item-file.component';
import { DblclickModule } from 'src/app/directives/dblclick/dblclick.module';

@NgModule({
    declarations: [FileManagerItemFileComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        NgbModule,
        DblclickModule
    ],
    exports: [FileManagerItemFileComponent]
})
export class FileManagementItemFileModule { }
