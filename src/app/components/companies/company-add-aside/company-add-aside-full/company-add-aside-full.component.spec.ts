import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAddAsideFullComponent } from './company-add-aside-full.component';

describe('CompanyAddAsideFullComponent', () => {
  let component: CompanyAddAsideFullComponent;
  let fixture: ComponentFixture<CompanyAddAsideFullComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyAddAsideFullComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyAddAsideFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
