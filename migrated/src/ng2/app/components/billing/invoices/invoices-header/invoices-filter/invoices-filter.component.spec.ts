import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesFilterComponent } from './invoices-filter.component';

describe('InvoicesFilterComponent', () => {
  let component: InvoicesFilterComponent;
  let fixture: ComponentFixture<InvoicesFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicesFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
