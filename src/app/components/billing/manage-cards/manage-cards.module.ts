import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageCardsRoutingModule } from './manage-cards-routing.module';
import { ManageCardsComponent } from './manage-cards.component';
import { ManageCardsHeaderComponent } from './manage-cards-header/manage-cards-header.component';
import { ManageCardsAddComponent } from './manage-cards-add/manage-cards-add.component';
import { R } from '@angular/cdk/keycodes';





import { ManageCardsTableComponent } from './manage-cards-table/manage-cards-table.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ManageCardsEditComponent } from './manage-cards-edit/manage-cards-edit.component';





@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    ManageCardsRoutingModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    NgbModule,
    ManageCardsComponent, ManageCardsHeaderComponent, ManageCardsTableComponent,
],
})
export class ManageCardsModule { }
