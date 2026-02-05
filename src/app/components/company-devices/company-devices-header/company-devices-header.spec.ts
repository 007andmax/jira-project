import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ClickOutsideModule } from 'ng4-click-outside';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';
import { CompanyDevicesHeaderComponent } from './company-devices-header.component';


describe('CompanyDevicesHeaderComponent unit test', () => {
  let component: CompanyDevicesHeaderComponent;
  let fixture: ComponentFixture<CompanyDevicesHeaderComponent>;

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
        NoopAnimationsModule],
      declarations: [CompanyDevicesHeaderComponent
      ],
    }).compileComponents();

  });
  it('check "setToggleFilter"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    com.setToggleFilter(true);
    expect(com.toggleFilter).toEqual(true);
  });
  it('check "getCountDevices"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getCountDevices()).toEqual(0);
  });
  it('check "getTextCountFilters"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    com.countFilter = 10;
    expect(com.getTextCountFilters()).toEqual('Filters (10)');
  });
  it('check "onChangeCountFilter"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeCountFilter();
<<<<<<< HEAD
    expect(com.countFilter).toEqual(2);
=======
    expect(com.countFilter).toEqual(0);
>>>>>>> QT-1398
  });
  it('check "getCountSelected"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getCountSelected()).toEqual(0);
  });
  it('check "isExistCustomDevices"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.isExistCustomDevices()).toEqual(false);
  });
});