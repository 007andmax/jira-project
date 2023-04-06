import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailDocumentsComponent } from './ticket-detail-documents.component';

describe('TicketDetailDocumentsComponent', () => {
  let component: TicketDetailDocumentsComponent;
  let fixture: ComponentFixture<TicketDetailDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
