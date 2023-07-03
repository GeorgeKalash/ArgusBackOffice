import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSetsFormComponent } from './data-sets-form.component';

describe('DataSetsFormComponent', () => {
  let component: DataSetsFormComponent;
  let fixture: ComponentFixture<DataSetsFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataSetsFormComponent]
    });
    fixture = TestBed.createComponent(DataSetsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
