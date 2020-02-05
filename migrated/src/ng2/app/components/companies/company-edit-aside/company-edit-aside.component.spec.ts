import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyEditAsideComponent } from './company-edit-aside.component';

describe('CompanyEditAsideComponent', () => {
  let component: CompanyEditAsideComponent;
  let fixture: ComponentFixture<CompanyEditAsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyEditAsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyEditAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
