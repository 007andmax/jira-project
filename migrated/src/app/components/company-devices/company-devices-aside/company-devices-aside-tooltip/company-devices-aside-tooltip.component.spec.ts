import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDevicesAsideTooltipComponent } from './company-devices-aside-tooltip.component';

describe('CompanyDevicesAsideTooltipComponent', () => {
  let component: CompanyDevicesAsideTooltipComponent;
  let fixture: ComponentFixture<CompanyDevicesAsideTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDevicesAsideTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDevicesAsideTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
