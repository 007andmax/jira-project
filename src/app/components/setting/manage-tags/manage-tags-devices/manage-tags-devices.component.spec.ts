import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTagsDevicesComponent } from './manage-tags-devices.component';

describe('ManageTagsDevicesComponent', () => {
  let component: ManageTagsDevicesComponent;
  let fixture: ComponentFixture<ManageTagsDevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageTagsDevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTagsDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
