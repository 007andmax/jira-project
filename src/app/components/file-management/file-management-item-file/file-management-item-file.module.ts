import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { FileManagementItemFileComponent } from './file-management-item-file.component';

@NgModule({
    declarations: [FileManagementItemFileComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        NgbModule,
    ],
    exports: [FileManagementItemFileComponent]
})
export class FileManagementItemFileModule { }
