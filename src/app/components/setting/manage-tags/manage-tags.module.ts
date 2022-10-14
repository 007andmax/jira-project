import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageTagsComponent } from './manage-tags.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TagPipe } from 'src/app/pipe/tag.pipe';
import { ManageTagsRoutingModule } from './manage-tags-routing.module';



@NgModule({
    declarations: [ManageTagsComponent,
        TagPipe
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        InfiniteScrollModule,
        ManageTagsRoutingModule
    ],
    exports: [TagPipe]


})
export class ManageTagsModule { }
