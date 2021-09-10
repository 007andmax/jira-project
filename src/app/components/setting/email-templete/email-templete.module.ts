import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailTempleteComponent } from './email-templete.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { SanitizeHtmlPipe } from 'src/app/pipe/sanitize-html.pipe';
import { EmailTempleteRoutingModule } from './email-templete-routing.module';





@NgModule({
    declarations: [EmailTempleteComponent,
        SanitizeHtmlPipe
    ],
    imports: [
        CommonModule,
        NgbModule,
        ReactiveFormsModule,
        EmailTempleteRoutingModule
    ],
    exports: [SanitizeHtmlPipe]


})
export class EmailTempleteModule { }
