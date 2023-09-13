import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTemplateFormComponent } from './report-template-form.component';

describe('ReportTemplateFormComponent', () => {
  let component: ReportTemplateFormComponent;
  let fixture: ComponentFixture<ReportTemplateFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportTemplateFormComponent]
    });
    fixture = TestBed.createComponent(ReportTemplateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
