import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketEditAsideComponent } from './ticket-edit-aside.component';

describe('TicketEditAsideComponent', () => {
  let component: TicketEditAsideComponent;
  let fixture: ComponentFixture<TicketEditAsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketEditAsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketEditAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
