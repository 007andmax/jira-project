import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyTimeZoneComponent } from './company-time-zone.component';

describe('CompanyTimeZoneComponent', () => {
  let component: CompanyTimeZoneComponent;
  let fixture: ComponentFixture<CompanyTimeZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyTimeZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyTimeZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
