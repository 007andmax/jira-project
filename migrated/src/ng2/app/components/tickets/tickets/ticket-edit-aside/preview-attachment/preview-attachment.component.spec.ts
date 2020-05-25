import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewAttachmentComponent } from './preview-attachment.component';

describe('PreviewAttachmentComponent', () => {
  let component: PreviewAttachmentComponent;
  let fixture: ComponentFixture<PreviewAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewAttachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
