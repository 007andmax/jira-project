import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ClickOutsideModule } from 'ng4-click-outside';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';
import { CompanyDevicesEditLabelComponent } from './company-devices-edit-label.component';


describe('CompanyDevicesEditLabelComponent unit test', () => {
  let component: CompanyDevicesEditLabelComponent;
  let fixture: ComponentFixture<CompanyDevicesEditLabelComponent>;

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
        NoopAnimationsModule, CompanyDevicesEditLabelComponent],
}).compileComponents();

  });
  it('check "ngOnInit"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesEditLabelComponent);
    const com = fixture.debugElement.componentInstance;
    com.field = "test";
    com.ngOnInit();
    expect(com.field).toEqual("test");
  });
  it('check "setIsInitEdit"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesEditLabelComponent);
    const com = fixture.debugElement.componentInstance;
    com.setIsInitEdit(true);
    expect(com.isInitEdit).toEqual(true);
  });
  it('check "setValue"', () => {
    const fixture = TestBed.createComponent(CompanyDevicesEditLabelComponent);
    const com = fixture.debugElement.componentInstance;
    com.setValue("name");
    expect(com.value).toEqual("name");
  });
});