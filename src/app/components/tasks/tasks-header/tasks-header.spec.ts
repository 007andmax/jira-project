import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TasksHeaderComponent } from './tasks-header.component';


describe('TasksHeaderComponent unit test', () => {
  let component: TasksHeaderComponent;
  let fixture: ComponentFixture<TasksHeaderComponent>;

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
        NoopAnimationsModule, TasksHeaderComponent]
}).compileComponents();

  });

  it('check "isExistFilters"', () => {
    const fixture = TestBed.createComponent(TasksHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.isExistFilters()).toEqual(undefined);
  });
  it('check "onToggleFilter"', () => {
    const fixture = TestBed.createComponent(TasksHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    com.onToggleFilter(true);
    expect(com.toggleFilter).toEqual(true);
  });

});