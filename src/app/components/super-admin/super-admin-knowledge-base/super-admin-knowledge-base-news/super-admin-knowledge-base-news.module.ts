import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SuperAdminKnowledgeBaseNewsComponent } from './super-admin-knowledge-base-news.component';




@NgModule({
    declarations: [SuperAdminKnowledgeBaseNewsComponent
    ],
    imports: [
        CommonModule,
        NgbModule,

    ],
    exports: [SuperAdminKnowledgeBaseNewsComponent]

})
export class SuperAdminKnowledgeBaseNewsModule { }
