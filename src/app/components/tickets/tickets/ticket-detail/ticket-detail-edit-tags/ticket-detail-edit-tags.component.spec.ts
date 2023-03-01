import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailEditTagsComponent } from './ticket-detail-edit-tags.component';

describe('TicketDetailEditTagsComponent', () => {
  let component: TicketDetailEditTagsComponent;
  let fixture: ComponentFixture<TicketDetailEditTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailEditTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailEditTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
