import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDetailsLeftPanelComponent } from './users-details-left-panel.component';

describe('UsersDetailsLeftPanelComponent', () => {
  let component: UsersDetailsLeftPanelComponent;
  let fixture: ComponentFixture<UsersDetailsLeftPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersDetailsLeftPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersDetailsLeftPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
