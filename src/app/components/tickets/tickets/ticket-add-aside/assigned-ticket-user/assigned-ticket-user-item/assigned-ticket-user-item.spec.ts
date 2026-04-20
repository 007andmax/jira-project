import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { TicketDetailEditTagsComponent } from '../../../ticket-detail/ticket-detail-edit-tags/ticket-detail-edit-tags.component';
import { AssignedTicketUserItemComponent } from './assigned-ticket-user-item.component';

describe('AssignedTicketUserItemComponent unit test', () => {
  let component: AssignedTicketUserItemComponent;
  let fixture: ComponentFixture<AssignedTicketUserItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        MatFormFieldModule,
        FormsModule,
        DropDownModule,
        NgbModule,
        DynamicTooltipModule,
        MatErrorModule,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule, AssignedTicketUserItemComponent]
}).compileComponents();

  });

  it('check "getUserName"', () => {
    const fixture = TestBed.createComponent(AssignedTicketUserItemComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getUserName(null)).toEqual('');
  });
  it('check "isSelected"', () => {
    const fixture = TestBed.createComponent(AssignedTicketUserItemComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.isSelected({ id: 1 })).toEqual(undefined);
    com.selectedUsers = [{ id: 1 }];
    expect(com.isSelected({ id: 1 })).toEqual({ id: 1 });
  });
});