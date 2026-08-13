import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewAttachmentTicketComponent } from './preview-attachment-ticket.component';

describe('PreviewAttachmentTicketComponent', () => {
  let component: PreviewAttachmentTicketComponent;
  let fixture: ComponentFixture<PreviewAttachmentTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewAttachmentTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewAttachmentTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
