import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyValue1Component } from './key-value1.component';

describe('KeyValue1Component', () => {
  let component: KeyValue1Component;
  let fixture: ComponentFixture<KeyValue1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeyValue1Component]
    });
    fixture = TestBed.createComponent(KeyValue1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
