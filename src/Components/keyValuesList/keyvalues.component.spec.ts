import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyValuesComponent } from './keyvalues.component';

describe('KeyValuesComponent', () => {
  let component: KeyValuesComponent;
  let fixture: ComponentFixture<KeyValuesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeyValuesComponent]
    });
    fixture = TestBed.createComponent(KeyValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
