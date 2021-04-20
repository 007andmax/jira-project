import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketEditAsideRightPanelComponent } from './ticket-edit-aside-right-panel.component';

describe('TicketEditAsideRightPanelComponent', () => {
  let component: TicketEditAsideRightPanelComponent;
  let fixture: ComponentFixture<TicketEditAsideRightPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketEditAsideRightPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketEditAsideRightPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
