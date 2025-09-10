import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityIssueCardsComponent } from './security-issue-cards.component';

describe('SecurityIssueCardsComponent', () => {
  let component: SecurityIssueCardsComponent;
  let fixture: ComponentFixture<SecurityIssueCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityIssueCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityIssueCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
