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
import { AssignedTicketUserComponent } from './assigned-ticket-user.component';
import { AssignedTicketUserSelectedItemComponent } from './assigned-ticket-user-selected-item/assigned-ticket-user-selected-item.component';
import { AssignedTicketUserItemComponent } from './assigned-ticket-user-item/assigned-ticket-user-item.component';

describe('AssignedTicketUserComponent unit test', () => {
  let component: AssignedTicketUserComponent;
  let fixture: ComponentFixture<AssignedTicketUserComponent>;

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
        NoopAnimationsModule],
      declarations: [AssignedTicketUserComponent,
        AssignedTicketUserSelectedItemComponent,
        AssignedTicketUserItemComponent
      ]
    }).compileComponents();

  });

  it('check "reset"', () => {
    const fixture = TestBed.createComponent(AssignedTicketUserComponent);
    const com = fixture.debugElement.componentInstance;
    com.reset(["1", "2", "3"]);
    expect(com.list).toEqual(["1", "2", "3"]);
    expect(com.reqList).toEqual(["1", "2", "3"]);
  });
  it('check "selectItemsWithOutChanges"', () => {
    const fixture = TestBed.createComponent(AssignedTicketUserComponent);
    const com = fixture.debugElement.componentInstance;
    com.selectItemsWithOutChanges(["1", "2", "3"]);
    expect(com.isAdd).toEqual(false);
  });
  it('check "selected"', () => {
    const fixture = TestBed.createComponent(AssignedTicketUserComponent);
    const com = fixture.debugElement.componentInstance;
    com.selected({ id: 1 })
    expect(com.selectedUsers).toEqual([{ id: 1 }]);
    com.selected({ id: 1 })
    expect(com.selectedUsers.length).toEqual(0);
  });
  it('check "clearSearch"', () => {
    const fixture = TestBed.createComponent(AssignedTicketUserComponent);
    const com = fixture.debugElement.componentInstance;
    com.clearSearch()
    expect(com.searchText).toEqual('');
  });
  it('check "getUserName"', () => {
    const fixture = TestBed.createComponent(AssignedTicketUserComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getUserName(null)).toEqual('');
  });
});