import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAsideDetailComponent } from './users-aside-detail.component';

describe('UsersAsideDetailComponent', () => {
  let component: UsersAsideDetailComponent;
  let fixture: ComponentFixture<UsersAsideDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersAsideDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersAsideDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
