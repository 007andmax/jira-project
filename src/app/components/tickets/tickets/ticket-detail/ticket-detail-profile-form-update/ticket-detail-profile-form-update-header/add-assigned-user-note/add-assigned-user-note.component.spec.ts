import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssignedUserNoteComponent } from './add-assigned-user-note.component';

describe('AddAssignedUserNoteComponent', () => {
  let component: AddAssignedUserNoteComponent;
  let fixture: ComponentFixture<AddAssignedUserNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAssignedUserNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssignedUserNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
