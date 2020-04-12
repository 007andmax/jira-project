import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesHeaderComponent } from './companies-header.component';

describe('CompaniesHeaderComponent', () => {
  let component: CompaniesHeaderComponent;
  let fixture: ComponentFixture<CompaniesHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompaniesHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
