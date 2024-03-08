import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTagsDevicesAddComponent } from './manage-tags-devices-add.component';

describe('ManageTagsDevicesAddComponent', () => {
  let component: ManageTagsDevicesAddComponent;
  let fixture: ComponentFixture<ManageTagsDevicesAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageTagsDevicesAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTagsDevicesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
