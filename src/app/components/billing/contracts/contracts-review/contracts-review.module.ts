import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractsReviewComponent } from './contracts-review.component';



@NgModule({
    declarations: [ContractsReviewComponent
    ],
    imports: [
        CommonModule,
    ],
    exports: [ContractsReviewComponent]
})
export class ContractsReviewModule { }
