import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailTempleteComponent } from './email-template.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { SanitizeHtmlPipe } from 'src/app/pipe/sanitize-html.pipe';
import { EmailTemplateRoutingModule } from './email-template-routing.module';





@NgModule({
    declarations: [EmailTempleteComponent,
        SanitizeHtmlPipe
    ],
    imports: [
        CommonModule,
        NgbModule,
        ReactiveFormsModule,
        EmailTemplateRoutingModule
    ],
    exports: [SanitizeHtmlPipe]


})
export class EmailTemplateModule { }
