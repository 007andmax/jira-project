import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsFilterSaveComponent } from './tickets-filter-save.component';

describe('TicketsFilterSaveComponent', () => {
  let component: TicketsFilterSaveComponent;
  let fixture: ComponentFixture<TicketsFilterSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketsFilterSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsFilterSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
