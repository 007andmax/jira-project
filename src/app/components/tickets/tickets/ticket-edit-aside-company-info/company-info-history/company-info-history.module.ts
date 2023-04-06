import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyInfoHistoryComponent } from './company-info-history.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
    declarations: [CompanyInfoHistoryComponent
    ],
    imports: [
        CommonModule,
        InfiniteScrollModule
    ],
    exports: [CompanyInfoHistoryComponent]
})
export class CompanyInfoHistoryModule { }
