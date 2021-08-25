import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from 'src/app/app.component';
import { PreloaderTicketComponent } from './preloader-ticket.component';

@NgModule({
    declarations: [
        PreloaderTicketComponent
    ],
    imports: [
        CommonModule,

        FormsModule,
        NgbModule,
    ],
    exports: [PreloaderTicketComponent],


})
export class PreloaderTicketModule { }
