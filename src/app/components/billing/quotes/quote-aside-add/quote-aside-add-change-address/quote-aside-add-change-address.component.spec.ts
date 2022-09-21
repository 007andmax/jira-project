import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteAsideAddChangeAddressComponent } from './quote-aside-add-change-address.component';

describe('QuoteAsideAddChangeAddressComponent', () => {
  let component: QuoteAsideAddChangeAddressComponent;
  let fixture: ComponentFixture<QuoteAsideAddChangeAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteAsideAddChangeAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteAsideAddChangeAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
