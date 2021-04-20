import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceItemQuoteComponent } from './service-item-quote.component';

describe('ServiceItemQuoteComponent', () => {
  let component: ServiceItemQuoteComponent;
  let fixture: ComponentFixture<ServiceItemQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceItemQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceItemQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
