import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageTagsComponent } from './manage-tags.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TagPipe } from 'src/app/pipe/tag.pipe';
import { ManageTagsRoutingModule } from './manage-tags-routing.module';
import { ClickOtsideModule } from 'src/app/directives/click-otside/click-otside.module';
import { ManageTagsAddComponent } from './manage-tags-add/manage-tags-add.component';



@NgModule({
    declarations: [ManageTagsComponent,
        TagPipe,
        ManageTagsAddComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        InfiniteScrollModule,
        ManageTagsRoutingModule,
        ClickOtsideModule
    ],
    exports: [TagPipe]


})
export class ManageTagsModule { }
