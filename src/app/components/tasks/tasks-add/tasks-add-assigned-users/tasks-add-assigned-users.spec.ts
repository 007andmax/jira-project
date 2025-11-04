import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';
import { TaskHeaderAddTypeComponent } from '../../task-header-add/task-header-add-type/task-header-add-type.component';
import { TasksAddAssignedUsersComponent } from './tasks-add-assigned-users.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


describe('TasksAddAssignedUsersComponent unit test', () => {
  let component: TasksAddAssignedUsersComponent;
  let fixture: ComponentFixture<TasksAddAssignedUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule,
        DropDownModule,
        MatFormFieldModule,
        MatChipListModule,
        DynamicTooltipModule,
        MatChipModule,
        NgbModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [TasksAddAssignedUsersComponent
      ]
    }).compileComponents();

  });

  it('check "isSelected"', () => {
    const fixture = TestBed.createComponent(TasksAddAssignedUsersComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.isSelected({ id: 1 })).toEqual(undefined);
  });
  it('check "toggleItem"', () => {
    const fixture = TestBed.createComponent(TasksAddAssignedUsersComponent);
    const com = fixture.debugElement.componentInstance;
    com.selectedTag = [{ id: "1" }];
    com.toggleItem({ id: "2" })
    expect(com.selectedTag).toEqual([{ id: "1" }, { id: "2" }]);
  });
});