import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesAsidePreviewComponent } from './invoices-aside-preview.component';

describe('InvoicesAsidePreviewComponent', () => {
  let component: InvoicesAsidePreviewComponent;
  let fixture: ComponentFixture<InvoicesAsidePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicesAsidePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicesAsidePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
