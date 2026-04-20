import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ClickOutsideModule } from 'ng4-click-outside';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';
import { CompanyDevicesNoExistRemoteSessionsComponent } from './company-devices-no-exist-remote-sessions.component';
 

describe('CompanyDevicesNoExistRemoteSessionsComponent unit test', () => {
  let component: CompanyDevicesNoExistRemoteSessionsComponent;
  let fixture: ComponentFixture<CompanyDevicesNoExistRemoteSessionsComponent>;

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
        NoopAnimationsModule, CompanyDevicesNoExistRemoteSessionsComponent],
}).compileComponents();

  });
  it('check "getUserName"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesNoExistRemoteSessionsComponent);
    const com = fixture.debugElement.componentInstance;
     expect(com.getUserName()).toEqual('');
  });
   it('check "returnTimeFormat"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesNoExistRemoteSessionsComponent);
    const com = fixture.debugElement.componentInstance;
     expect(com.returnTimeFormat(3600000)).toEqual({
      hours: 1,
      minutes: 0,
    });
  });
});