import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { FileManagerItemCategoryComponent } from './file-manager-item-category.component';
import { DblclickModule } from 'src/app/directives/dblclick/dblclick.module';

@NgModule({
    declarations: [FileManagerItemCategoryComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        NgbModule,
        DblclickModule
    ],
    exports: [FileManagerItemCategoryComponent]
})
export class FileManagementItemCategoryModule { }
