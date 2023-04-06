import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailDocumentsDetailsComponent } from './ticket-detail-documents-details.component';

describe('TicketDetailDocumentsDetailsComponent', () => {
  let component: TicketDetailDocumentsDetailsComponent;
  let fixture: ComponentFixture<TicketDetailDocumentsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailDocumentsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailDocumentsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
