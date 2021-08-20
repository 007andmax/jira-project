import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAsideDetailPasswordsItemComponent } from './users-aside-detail-passwords-item.component';

describe('UsersAsideDetailPasswordsItemComponent', () => {
  let component: UsersAsideDetailPasswordsItemComponent;
  let fixture: ComponentFixture<UsersAsideDetailPasswordsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersAsideDetailPasswordsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersAsideDetailPasswordsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
