import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageTagsComponent } from './manage-tags.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TagPipe } from 'src/app/pipe/tag.pipe';
import { ManageTagsRoutingModule } from './manage-tags-routing.module';
import { ClickOutsideModule } from 'src/app/directives/click-otside/click-otside.module';
import { ManageTagsAddComponent } from './manage-tags-add/manage-tags-add.component';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { ManageTagsDevicesComponent } from './manage-tags-devices/manage-tags-devices.component';
import { ManageTagsDevicesAddComponent } from './manage-tags-devices/manage-tags-devices-add/manage-tags-devices-add.component';
import { DeviceTagPipe } from 'src/app/pipe/device-tag.pipe';
import { ManageTagsFilesComponent } from './manage-tags-files/manage-tags-files.component';
import { MatFormFieldModule } from '@angular/material';



@NgModule({
    declarations: [ManageTagsComponent,
        TagPipe,
        ManageTagsAddComponent,
        ManageTagsDevicesComponent,
        ManageTagsDevicesAddComponent,
        DeviceTagPipe,
        ManageTagsFilesComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        InfiniteScrollModule,
        ManageTagsRoutingModule,
        ClickOutsideModule,
        KeyUpEnterModule,
        DynamicTooltipModule,
        MatFormFieldModule,
    ],
    exports: [TagPipe]


})
export class ManageTagsModule { }
