import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';
import { AddAssignedUserNoteComponent } from './add-assigned-user-note.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('AddAssignedUserNoteComponent unit test', () => {
  let component: AddAssignedUserNoteComponent;
  let fixture: ComponentFixture<AddAssignedUserNoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        NgbModule,
        FormsModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
        MatErrorModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        })
      ],
      declarations: [AddAssignedUserNoteComponent
      ],
    }).compileComponents();

  });

  it('check "remove"', () => {
    const fixture = TestBed.createComponent(AddAssignedUserNoteComponent);
    const com = fixture.debugElement.componentInstance;
    com.selectedUsers = [1, 2];
    com.remove(1)
    expect(com.selectedUsers).toEqual([1]);
  });
  it('check "selected"', () => {
    const fixture = TestBed.createComponent(AddAssignedUserNoteComponent);
    const com = fixture.debugElement.componentInstance;
    com.selected({ id: 1 });
    expect(com.selectedUsers).toEqual([{ id: 1 }]);
  });
  it('check "isSelected"', () => {
    const fixture = TestBed.createComponent(AddAssignedUserNoteComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.isSelected({ id: 1 })).toEqual(undefined);
    com.selectedUsers = [{ id: 1 }];
    expect(com.isSelected({ id: 1 })).toEqual({ id: 1 });
  });
  it('check "getAssignedUserNameForAvatar"', () => {
    const fixture = TestBed.createComponent(AddAssignedUserNoteComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getAssignedUserNameForAvatar()).toEqual('');
  });
  it('check "getUserName"', () => {
    const fixture = TestBed.createComponent(AddAssignedUserNoteComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getUserName()).toEqual('');
  });
  it('check "close"', () => {
    const fixture = TestBed.createComponent(AddAssignedUserNoteComponent);
    const com = fixture.debugElement.componentInstance;
    com.selectedUsers = [1, 2, 3, 4];
    com.close();
    expect(com.selectedUsers.length).toEqual(0);
  });
});