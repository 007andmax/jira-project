import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketEditTagsComponent } from './ticket-edit-tags.component';

describe('TicketEditTagsComponent', () => {
  let component: TicketEditTagsComponent;
  let fixture: ComponentFixture<TicketEditTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketEditTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketEditTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
