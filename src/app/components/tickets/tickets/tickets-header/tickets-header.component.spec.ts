import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsHeaderComponent } from './tickets-header.component';

describe('TicketsHeaderComponent', () => {
  let component: TicketsHeaderComponent;
  let fixture: ComponentFixture<TicketsHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketsHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
