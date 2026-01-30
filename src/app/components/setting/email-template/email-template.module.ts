import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { EmailTempleteComponent } from './email-template.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { SanitizeHtmlPipe } from 'src/app/pipe/sanitize-html.pipe';
import { EmailTemplateRoutingModule } from './email-template-routing.module';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { KeysValueModule } from 'src/app/pipe/keys-value/keys-value.module';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
    declarations: [EmailTempleteComponent,
        SanitizeHtmlPipe,
    ],
    imports: [
        CommonModule,
        NgbModule,
        ReactiveFormsModule,
        EmailTemplateRoutingModule,
        DynamicTooltipModule,
        KeysValueModule,
        AngularEditorModule
    ],
})
export class EmailTemplateModule { }
