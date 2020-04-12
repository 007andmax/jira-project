import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAsideEditComponent } from './users-aside-edit.component';

describe('UsersAsideEditComponent', () => {
  let component: UsersAsideEditComponent;
  let fixture: ComponentFixture<UsersAsideEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersAsideEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersAsideEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
