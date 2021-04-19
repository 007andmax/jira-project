import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceListQuoteComponent } from './service-list-quote.component';

describe('ServiceListQuoteComponent', () => {
  let component: ServiceListQuoteComponent;
  let fixture: ComponentFixture<ServiceListQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceListQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceListQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
