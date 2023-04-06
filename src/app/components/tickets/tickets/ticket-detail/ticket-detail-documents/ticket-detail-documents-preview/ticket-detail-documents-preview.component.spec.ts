import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailDocumentsPreviewComponent } from './ticket-detail-documents-preview.component';

describe('TicketDetailDocumentsPreviewComponent', () => {
  let component: TicketDetailDocumentsPreviewComponent;
  let fixture: ComponentFixture<TicketDetailDocumentsPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailDocumentsPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailDocumentsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
