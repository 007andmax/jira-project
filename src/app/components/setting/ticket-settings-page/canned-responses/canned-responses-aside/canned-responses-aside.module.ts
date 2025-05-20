import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { CannedResponsesAsideComponent } from './canned-responses-aside.component';


@NgModule({
    declarations: [
        CannedResponsesAsideComponent,
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        AngularEditorModule,
        MatErrorModule
    ],
    exports: [CannedResponsesAsideComponent]
})
export class CannedResponsesAsideModule { }
