import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotesFilterComponent } from './quotes-filter.component';

describe('QuotesFilterComponent', () => {
  let component: QuotesFilterComponent;
  let fixture: ComponentFixture<QuotesFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotesFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
