import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { DatePickerModule } from '../../shared/date-picker/date-picker.module';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { MatChipListModule } from '../../shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from '../../shared/mat-chip/mat-chip.module';
import { MatFormFieldModule } from '../../shared/mat-form-field/mat-form-field.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { CompanyDevicesAssestTypeDropDownModule } from './company-devices-assest-type-drop-down/company-devices-assest-type-drop-down.module';
import { CompanyDevicesCustomAsideComponent } from './company-devices-custom-aside.component';
import { ManufacturesDropDownComponent } from './manufactures-drop-down/manufactures-drop-down.component';
import { ModelsDropDownComponent } from './models-drop-down/models-drop-down.component';
import { CompanyDevicesCustomDropDownComponent } from './company-devices-custom-drop-down/company-devices-custom-drop-down.component';


describe('CompanyDevicesCustomAsideComponent unit test', () => {
  let component: CompanyDevicesCustomAsideComponent;
  let fixture: ComponentFixture<CompanyDevicesCustomAsideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        FormsModule,
        DropDownModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
        PreloaderTicketModule,
        DisabledBtnModule,
        DatePickerModule,
        NgbModule,
        DynamicTooltipModule,
        CompanyDevicesAssestTypeDropDownModule,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule, CompanyDevicesCustomAsideComponent,
        CompanyDevicesCustomDropDownComponent,
        ManufacturesDropDownComponent,
        ModelsDropDownComponent],
}).compileComponents();

  });
  it('check "onSelectTags"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesCustomAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectTags([{ id: 1 }]);
    expect(com.device.tags).toEqual([{ id: 1 }]);
  });
  it('check "onSelectAssestType"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesCustomAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectAssestType("test");
    expect(com.device.type).toEqual("test");
  });
  it('check "onSelectModel"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesCustomAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectModel(null);
    expect(com.device.modelId).toEqual(null);
  });
});