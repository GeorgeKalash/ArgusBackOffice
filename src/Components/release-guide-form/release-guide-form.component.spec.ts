import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseGuideFormComponent } from './release-guide-form.component';

describe('ReleaseGuideFormComponent', () => {
  let component: ReleaseGuideFormComponent;
  let fixture: ComponentFixture<ReleaseGuideFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReleaseGuideFormComponent]
    });
    fixture = TestBed.createComponent(ReleaseGuideFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
