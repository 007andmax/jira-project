import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAddAsideComponent } from './company-add-aside.component';

describe('CompanyAddAsideComponent', () => {
  let component: CompanyAddAsideComponent;
  let fixture: ComponentFixture<CompanyAddAsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyAddAsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyAddAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
