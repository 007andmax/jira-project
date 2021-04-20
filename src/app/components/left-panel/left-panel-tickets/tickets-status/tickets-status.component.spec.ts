import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsStatusComponent } from './tickets-status.component';

describe('TicketsStatusComponent', () => {
  let component: TicketsStatusComponent;
  let fixture: ComponentFixture<TicketsStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketsStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
