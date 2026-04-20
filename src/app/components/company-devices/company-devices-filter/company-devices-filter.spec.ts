import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ClickOutsideModule } from 'ng4-click-outside';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';
import { CompanyDevicesFilterComponent } from './company-devices-filter.component';


describe('CompanyDevicesFilterComponent unit test', () => {
  let component: CompanyDevicesFilterComponent;
  let fixture: ComponentFixture<CompanyDevicesFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        FormsModule,
        ClickOutsideModule,
        KeyUpEnterModule,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule, CompanyDevicesFilterComponent],
}).compileComponents();

  });
  it('check "onChangeCustomDevice"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesFilterComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeCustomDevice({ target: { checked: true } });
    expect(com.filter.isCustomDevices).toEqual(true);
  });
  it('check "onChangeAgent"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesFilterComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeAgent({ target: { checked: true } });
    expect(com.filter.isAgent).toEqual(true);
  });
  it('check "onSelectType"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesFilterComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectType([]);
    expect(com.filter.assestType).toEqual([]);
  });
});