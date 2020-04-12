import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectClientCompanyComponent } from './select-client-company.component';

describe('SelectClientCompanyComponent', () => {
  let component: SelectClientCompanyComponent;
  let fixture: ComponentFixture<SelectClientCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectClientCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectClientCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
