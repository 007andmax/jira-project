import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAsideDetailPasswordsComponent } from './users-aside-detail-passwords.component';

describe('UsersAsideDetailPasswordsComponent', () => {
  let component: UsersAsideDetailPasswordsComponent;
  let fixture: ComponentFixture<UsersAsideDetailPasswordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersAsideDetailPasswordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersAsideDetailPasswordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
