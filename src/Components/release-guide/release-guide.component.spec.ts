import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseGuideComponent } from './release-guide.component';

describe('ReleaseGuideComponent', () => {
  let component: ReleaseGuideComponent;
  let fixture: ComponentFixture<ReleaseGuideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReleaseGuideComponent]
    });
    fixture = TestBed.createComponent(ReleaseGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
