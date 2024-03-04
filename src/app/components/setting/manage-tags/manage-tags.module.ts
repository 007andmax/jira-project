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
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { ManageTagsDevicesComponent } from './manage-tags-devices/manage-tags-devices.component';
import { ManageTagsDevicesAddComponent } from './manage-tags-devices/manage-tags-devices-add/manage-tags-devices-add.component';



@NgModule({
    declarations: [ManageTagsComponent,
        TagPipe,
        ManageTagsAddComponent,
        ManageTagsDevicesComponent,
        ManageTagsDevicesAddComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        InfiniteScrollModule,
        ManageTagsRoutingModule,
        ClickOtsideModule,
        KeyUpEnterModule,
        DynamicTooltipModule
    ],
    exports: [TagPipe]


})
export class ManageTagsModule { }
