import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { EmailTempleteComponent } from './email-template.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { SanitizeHtmlPipe } from 'src/app/pipe/sanitize-html.pipe';
import { EmailTemplateRoutingModule } from './email-template-routing.module';


import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
    imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    EmailTemplateRoutingModule,
    AngularEditorModule,
    EmailTempleteComponent,
    SanitizeHtmlPipe
],
})
export class EmailTemplateModule { }
