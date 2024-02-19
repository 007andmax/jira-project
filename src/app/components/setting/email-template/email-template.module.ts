import { NgModule } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { EmailTempleteComponent } from './email-template.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { SanitizeHtmlPipe } from 'src/app/pipe/sanitize-html.pipe';
import { EmailTemplateRoutingModule } from './email-template-routing.module';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { KeysValueModule } from 'src/app/pipe/keys-value/keys-value.module';


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
        KeysValueModule
    ],
    exports: [SanitizeHtmlPipe]


})
export class EmailTemplateModule { }
