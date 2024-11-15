import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDetailsTabPasswordsComponent } from './users-details-tab-passwords.component';

describe('UsersDetailsTabPasswordsComponent', () => {
  let component: UsersDetailsTabPasswordsComponent;
  let fixture: ComponentFixture<UsersDetailsTabPasswordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersDetailsTabPasswordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersDetailsTabPasswordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
