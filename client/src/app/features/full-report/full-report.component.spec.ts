import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullReportComponent } from './full-report.component';

describe('FullReportComponent', () => {
  let component: FullReportComponent;
  let fixture: ComponentFixture<FullReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
