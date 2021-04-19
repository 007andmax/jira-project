import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssignedUserComponent } from './add-assigned-user.component';

describe('AddAssignedUserComponent', () => {
  let component: AddAssignedUserComponent;
  let fixture: ComponentFixture<AddAssignedUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAssignedUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssignedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
