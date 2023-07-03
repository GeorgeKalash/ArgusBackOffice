import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslatorsComponent } from './translators.component';

describe('TranslatorsComponent', () => {
  let component: TranslatorsComponent;
  let fixture: ComponentFixture<TranslatorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TranslatorsComponent]
    });
    fixture = TestBed.createComponent(TranslatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
