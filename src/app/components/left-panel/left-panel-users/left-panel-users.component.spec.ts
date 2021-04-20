import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftPanelUsersComponent } from './left-panel-users.component';

describe('LeftPanelUsersComponent', () => {
  let component: LeftPanelUsersComponent;
  let fixture: ComponentFixture<LeftPanelUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftPanelUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftPanelUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
