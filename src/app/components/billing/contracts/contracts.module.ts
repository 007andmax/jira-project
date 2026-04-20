import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractsComponent } from './contracts.component';





import { ContractsRoutingModule } from './contracts-routing.module';
import { ContractsReviewComponent } from './contracts-review/contracts-review.component';




@NgModule({
    imports: [
    CommonModule,
    ContractsRoutingModule,
    ContractsComponent
],
})
export class ContractsModule { }
