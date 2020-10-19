import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotesItemComponent } from './quotes-item.component';

describe('QuotesItemComponent', () => {
  let component: QuotesItemComponent;
  let fixture: ComponentFixture<QuotesItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotesItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
