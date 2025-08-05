import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketDetailLinkedAgentsComponent } from './ticket-detail-linked-agents.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';
import { MatOptionModule } from 'src/app/components/shared/mat-option/mat-option.module';

@NgModule({
  declarations: [TicketDetailLinkedAgentsComponent],
  imports: [
    CommonModule,
    NgbModule,
    MatChipModule,
    MatChipListModule,
    MatOptionModule,
    MatFormFieldModule
  ],
  exports: [TicketDetailLinkedAgentsComponent]
})
export class TicketDetailLinkedAgentsModule {}
