import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotesTableComponent } from './quotes-table.component';

describe('QuotesTableComponent', () => {
  let component: QuotesTableComponent;
  let fixture: ComponentFixture<QuotesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
