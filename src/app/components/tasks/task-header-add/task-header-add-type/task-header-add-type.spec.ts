import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CompanySetting } from 'src/app/components/companies/class/company-setting';
import { TaskHeaderAddTypeComponent } from './task-header-add-type.component';


describe('TaskHeaderAddTypeComponent unit test', () => {
  let component: TaskHeaderAddTypeComponent;
  let fixture: ComponentFixture<TaskHeaderAddTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        FormsModule,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule, TaskHeaderAddTypeComponent]
}).compileComponents();

  });

  it('check "initDefaultValue"', () => {
    const fixture = TestBed.createComponent(TaskHeaderAddTypeComponent);
    const com = fixture.debugElement.componentInstance;
    com.initDefaultValue();
    expect(com.selectedType).toEqual(new CompanySetting('To do', 'To do'));
  });
  it('check "clearWithOutChanges"', () => {
    const fixture = TestBed.createComponent(TaskHeaderAddTypeComponent);
    const com = fixture.debugElement.componentInstance;
    com.initDefaultValue();
    com.clearWithOutChanges();
    expect(com.selectedType).toEqual(null);
  });
  it('check "onSelect"', () => {
    const fixture = TestBed.createComponent(TaskHeaderAddTypeComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelect(new CompanySetting('Phone call', 'Phone call'));
    expect(com.selectedType).toEqual(new CompanySetting('Phone call', 'Phone call'));
  });
  it('check "isSelected"', () => {
    const fixture = TestBed.createComponent(TaskHeaderAddTypeComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.isSelected(new CompanySetting('Phone call', 'Phone call'))).toEqual(false);
  });

});