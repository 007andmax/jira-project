import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiCompanyDropDownComponent } from './multi-company-drop-down.component';

describe('MultiCompanyDropDownComponent', () => {
  let component: MultiCompanyDropDownComponent;
  let fixture: ComponentFixture<MultiCompanyDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiCompanyDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiCompanyDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
