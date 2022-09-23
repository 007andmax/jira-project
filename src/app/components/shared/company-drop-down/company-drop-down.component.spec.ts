import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDropDownComponent } from './company-drop-down.component';

describe('CompanyDropDownComponent', () => {
  let component: CompanyDropDownComponent;
  let fixture: ComponentFixture<CompanyDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
