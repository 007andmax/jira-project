import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsFilterEditComponent } from './tickets-filter-edit.component';

describe('TicketsFilterEditComponent', () => {
  let component: TicketsFilterEditComponent;
  let fixture: ComponentFixture<TicketsFilterEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketsFilterEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsFilterEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
