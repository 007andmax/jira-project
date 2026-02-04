import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ClickOutsideModule } from 'ng4-click-outside';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';
import { CompanyDevicesExistRemoteSessionsComponent } from './company-devices-exist-remote-sessions.component';
 

describe('CompanyDevicesExistRemoteSessionsComponent unit test', () => {
  let component: CompanyDevicesExistRemoteSessionsComponent;
  let fixture: ComponentFixture<CompanyDevicesExistRemoteSessionsComponent>;

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
      declarations: [CompanyDevicesExistRemoteSessionsComponent
      ],
    }).compileComponents();

  });
  it('check "setToggleFilter"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesExistRemoteSessionsComponent);
    const com = fixture.debugElement.componentInstance;
     expect(com.getUserName()).toEqual('');
  });
   it('check "returnTimeFormat"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesExistRemoteSessionsComponent);
    const com = fixture.debugElement.componentInstance;
     expect(com.returnTimeFormat(3600000)).toEqual({
      hours: 1,
      minutes: 0,
    });
  });
});