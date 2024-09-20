import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDropDownComponent } from './users-drop-down.component';

describe('UsersDropDownComponent', () => {
  let component: UsersDropDownComponent;
  let fixture: ComponentFixture<UsersDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
