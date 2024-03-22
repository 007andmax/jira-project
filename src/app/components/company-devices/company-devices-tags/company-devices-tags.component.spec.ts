import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDevicesTagsComponent } from './company-devices-tags.component';

describe('CompanyDevicesTagsComponent', () => {
  let component: CompanyDevicesTagsComponent;
  let fixture: ComponentFixture<CompanyDevicesTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDevicesTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDevicesTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
