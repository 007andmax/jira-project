import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDetailsTabPasswordsItemComponent } from './users-details-tab-passwords-item.component';

describe('UsersDetailsTabPasswordsItemComponent', () => {
  let component: UsersDetailsTabPasswordsItemComponent;
  let fixture: ComponentFixture<UsersDetailsTabPasswordsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersDetailsTabPasswordsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersDetailsTabPasswordsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
