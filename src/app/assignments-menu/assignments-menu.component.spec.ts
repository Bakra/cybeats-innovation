import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentsMenuComponent } from './assignments-menu.component';

describe('AssignmentsMenuComponent', () => {
  let component: AssignmentsMenuComponent;
  let fixture: ComponentFixture<AssignmentsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentsMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignmentsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
