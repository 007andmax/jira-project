import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportPageComponent } from './support-page.component';
import { SupportPageRoutingModule } from './support-page-routing.module';
import { SupportPageBodyComponent } from './support-page-body/support-page-body.component';
import { SupportPageBreadcrumbsComponent } from './support-page-breadcrumbs/support-page-breadcrumbs.component';
import { SupportPageCategoryComponent } from './support-page-category/support-page-category.component';
import { SupportPageHeaderComponent } from './support-page-header/support-page-header.component';
import { SupportPageHelpCenterComponent } from './support-page-help-center/support-page-help-center.component';
import { SupportPageInfoTagsComponent } from './support-page-info/support-page-info-tags/support-page-info-tags.component';
import { SupportPageInfoComponent } from './support-page-info/support-page-info.component';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { LeftPanelSuperAdminCategoriesComponent } from '../left-panel-super-admin-categories/left-panel-super-admin-categories.component';
import { DragMenuModule } from 'src/app/directives/drag-menu/drag-menu.module';
import { SortTagsPipe } from './support-page-info/support-page-info-tags/pipe/sort-tags.pipe';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { LeftPanelSuperAdminCategoriesActionsComponent } from '../left-panel-super-admin-categories/left-panel-super-admin-categories-actions/left-panel-super-admin-categories-actions.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SupportPageEditCategoryModule } from '../shared/support-page-edit-category/support-page-edit-category.module';




@NgModule({
    declarations: [SupportPageComponent,
        SupportPageBodyComponent,
        SupportPageBreadcrumbsComponent,
        SupportPageCategoryComponent,
        SupportPageHeaderComponent,
        SupportPageHelpCenterComponent,
        SupportPageInfoTagsComponent,
        SupportPageInfoComponent,
        LeftPanelSuperAdminCategoriesComponent,
        LeftPanelSuperAdminCategoriesActionsComponent,
        SortTagsPipe
    ],
    imports: [
        CommonModule,
        SupportPageRoutingModule,
        DisabledBtnModule,
        DragMenuModule,
        DynamicTooltipModule,
        FroalaEditorModule.forRoot(),
        FroalaViewModule.forRoot(),
        NgbModule,
        FormsModule,
    ],

})
export class SupportPageModule { }
