import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketAddAsideComponent } from './ticket-add-aside.component';

describe('TicketAddAsideComponent', () => {
  let component: TicketAddAsideComponent;
  let fixture: ComponentFixture<TicketAddAsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketAddAsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketAddAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
