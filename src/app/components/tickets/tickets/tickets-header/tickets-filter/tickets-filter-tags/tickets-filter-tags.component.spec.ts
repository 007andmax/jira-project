import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsFilterTagsComponent } from './tickets-filter-tags.component';

describe('TicketsFilterTagsComponent', () => {
  let component: TicketsFilterTagsComponent;
  let fixture: ComponentFixture<TicketsFilterTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketsFilterTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsFilterTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
