import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDetailsHeaderComponent } from './users-details-header.component';

describe('UsersDetailsHeaderComponent', () => {
  let component: UsersDetailsHeaderComponent;
  let fixture: ComponentFixture<UsersDetailsHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersDetailsHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersDetailsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
