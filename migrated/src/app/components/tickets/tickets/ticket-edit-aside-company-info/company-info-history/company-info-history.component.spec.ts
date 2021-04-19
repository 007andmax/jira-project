import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyInfoHistoryComponent } from './company-info-history.component';

describe('CompanyInfoHistoryComponent', () => {
  let component: CompanyInfoHistoryComponent;
  let fixture: ComponentFixture<CompanyInfoHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyInfoHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyInfoHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
