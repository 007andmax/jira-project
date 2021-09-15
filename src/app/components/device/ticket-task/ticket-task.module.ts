import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketTaskComponent } from '../ticket-task/ticket-task.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { searchTextPipe } from '../_pipe/searchText.pipe';
import { NgxUploaderModule } from 'ngx-uploader';



@NgModule({
    declarations: [TicketTaskComponent,
        searchTextPipe
    ],
    imports: [
        CommonModule,
        NgbModule,
        ReactiveFormsModule,
        FormsModule,
        NgxUploaderModule
    ],
    exports: [TicketTaskComponent, searchTextPipe]


})
export class TicketTaskModule { }
