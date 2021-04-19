import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesAsideComponent } from './invoices-aside.component';

describe('InvoicesAsideComponent', () => {
  let component: InvoicesAsideComponent;
  let fixture: ComponentFixture<InvoicesAsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicesAsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicesAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
