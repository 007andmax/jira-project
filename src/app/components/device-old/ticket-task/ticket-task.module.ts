import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketTaskComponent } from './ticket-task.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { searchTextPipe } from '../_pipe/searchText.pipe';
import { NgxUploaderModule } from 'ngx-uploader';



@NgModule({
    declarations: [TicketTaskComponent,
        searchTextPipe
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        NgxUploaderModule,
    ],
    exports: [TicketTaskComponent]

})
export class TicketTaskModule { }
