import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesFilterComponent } from './companies-filter.component';

describe('CompaniesFilterComponent', () => {
  let component: CompaniesFilterComponent;
  let fixture: ComponentFixture<CompaniesFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompaniesFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
