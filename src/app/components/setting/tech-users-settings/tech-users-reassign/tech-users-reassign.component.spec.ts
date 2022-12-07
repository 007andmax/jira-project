import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechUsersReassignComponent } from './tech-users-reassign.component';

describe('TechUsersReassignComponent', () => {
  let component: TechUsersReassignComponent;
  let fixture: ComponentFixture<TechUsersReassignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechUsersReassignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechUsersReassignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
