import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { GlobalSearchComponent } from './global-search/global-search.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { TaskHeaderAddModule } from '../tasks/task-header-add/task-header-add.module';



@NgModule({
    declarations: [HeaderComponent,
        GlobalSearchComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
        TaskHeaderAddModule
    ],
    exports: [HeaderComponent]


})
export class HeaderModule { }
