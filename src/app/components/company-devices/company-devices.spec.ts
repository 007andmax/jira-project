import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ClickOutsideModule } from 'ng4-click-outside';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { DatePickerModule } from '../shared/date-picker/date-picker.module';
import { DropDownModule } from '../shared/drop-down/drop-down.module';
import { DynamicTooltipModule } from '../shared/dynamic-tooltip/dynamic-tooltip.module';
import { MatChipListModule } from '../shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from '../shared/mat-chip/mat-chip.module';
import { MatErrorModule } from '../shared/mat-error/mat-error.module';
import { MatFormFieldModule } from '../shared/mat-form-field/mat-form-field.module';
import { CompanyDevicesAsideDeviceIconComponent } from './company-devices-aside/company-devices-aside-device-icon/company-devices-aside-device-icon.component';
import { CompanyDevicesAsideNetworkTabComponent } from './company-devices-aside/company-devices-aside-network-tab/company-devices-aside-network-tab.component';
import { CompanyDevicesAsideSoftwareComponent } from './company-devices-aside/company-devices-aside-software/company-devices-aside-software.component';
import { CompanyDevicesAsideSystemComponent } from './company-devices-aside/company-devices-aside-system/company-devices-aside-system.component';
import { CompanyDevicesAsideUpdatesComponent } from './company-devices-aside/company-devices-aside-updates/company-devices-aside-updates.component';
import { CompanyDevicesAsideComponent } from './company-devices-aside/company-devices-aside.component';
import { CompanyDevicesCustomAsideModule } from './company-devices-custom-aside/company-devices-custom-aside.module';
import { CompanyDevicesEditIpComponent } from './company-devices-edit-ip/company-devices-edit-ip.component';
import { CompanyDevicesEditLabelModule } from './company-devices-edit-label/company-devices-edit-label.module';
import { CompanyDevicesEditMacComponent } from './company-devices-edit-mac/company-devices-edit-mac.component';
import { CompanyDevicesFilterTypeComponent } from './company-devices-filter/company-devices-filter-type/company-devices-filter-type.component';
import { CompanyDevicesFilterComponent } from './company-devices-filter/company-devices-filter.component';
import { CompanyDevicesHeaderComponent } from './company-devices-header/company-devices-header.component';
import { CompanyDevicesExistRemoteSessionsComponent } from './company-devices-item/company-devices-exist-remote-sessions/company-devices-exist-remote-sessions.component';
import { CompanyDevicesNoExistRemoteSessionsComponent } from './company-devices-item/company-devices-no-exist-remote-sessions/company-devices-no-exist-remote-sessions.component';
import { CompanyDevicesRoutingModule } from './company-devices-routing.module';
import { CompanyDevicesTagsModule } from './company-devices-tags/company-devices-tags.module';
import { CompanyDevicesComponent } from './company-devices.component';
import { FilterDevicesPipe } from './pipe/filter-devices.pipe';
import { CompanyDevicesItemComponent } from './company-devices-item/company-devices-item.component';
 declare var jasmine;
 const mockRouter = {
   navigate: jasmine.createSpy('navigate'),
   routerState: {
     root: {}
   },
   events: of(),
 };

describe('CompanyDevicesComponent unit test', () => {
  let component: CompanyDevicesComponent;
  let fixture: ComponentFixture<CompanyDevicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
              FormsModule,
              NgbModule,
              CompanyDevicesEditLabelModule,
              DatePickerModule,
              CompanyDevicesRoutingModule,
              CompanyDevicesTagsModule,
              CompanyDevicesCustomAsideModule,
              TextAreaModule,
              DropDownModule,
              ClickOutsideModule,
              KeyUpEnterModule,
              MatErrorModule,
              DynamicTooltipModule,
              MatChipModule,
              MatFormFieldModule,
              MatChipListModule,
        HttpClientModule,
        RouterTestingModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
        providers: [{ provide: Router, useValue: mockRouter }],
      declarations: [CompanyDevicesComponent,
              CompanyDevicesHeaderComponent,
              CompanyDevicesItemComponent,
              CompanyDevicesAsideComponent,
              CompanyDevicesNoExistRemoteSessionsComponent,
              CompanyDevicesExistRemoteSessionsComponent,
              CompanyDevicesAsideDeviceIconComponent,
              CompanyDevicesAsideSystemComponent,
              CompanyDevicesAsideNetworkTabComponent,
              CompanyDevicesAsideSoftwareComponent,
              CompanyDevicesAsideUpdatesComponent,
              CompanyDevicesEditIpComponent,
              CompanyDevicesEditMacComponent,
              CompanyDevicesFilterComponent,
              CompanyDevicesFilterTypeComponent,
              FilterDevicesPipe,
      ],
    }).compileComponents();

  });
  it('check "onChangeSelect"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeSelect();
     expect(com.selectAllDevices).toEqual(true);
  });
     it('check "toogleDevices"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesComponent);
    const com = fixture.debugElement.componentInstance;
    com.toogleDevices();
     expect(com.isOfflineDeviceSelected).toEqual(false);
  });
  it('check "isLabel"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.isLabel({
      label: 'test',
      hostName: 'host',
    })).toEqual(true);
  });
});