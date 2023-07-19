import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyValueFormComponent } from './key-value-form.component';

describe('KeyValueFormComponent', () => {
  let component: KeyValueFormComponent;
  let fixture: ComponentFixture<KeyValueFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeyValueFormComponent]
    });
    fixture = TestBed.createComponent(KeyValueFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
