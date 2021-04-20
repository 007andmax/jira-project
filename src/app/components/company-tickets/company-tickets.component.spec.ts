import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyTicketsComponent } from './company-tickets.component';

describe('CompanyTicketsComponent', () => {
  let component: CompanyTicketsComponent;
  let fixture: ComponentFixture<CompanyTicketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyTicketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
