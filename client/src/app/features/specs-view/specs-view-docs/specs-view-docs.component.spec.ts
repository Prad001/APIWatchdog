import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecsViewDocsComponent } from './specs-view-docs.component';

describe('SpecsViewDocsComponent', () => {
  let component: SpecsViewDocsComponent;
  let fixture: ComponentFixture<SpecsViewDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecsViewDocsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecsViewDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
