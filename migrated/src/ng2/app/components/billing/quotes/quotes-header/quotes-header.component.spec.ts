import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotesHeaderComponent } from './quotes-header.component';

describe('QuotesHeaderComponent', () => {
  let component: QuotesHeaderComponent;
  let fixture: ComponentFixture<QuotesHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotesHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotesHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
