import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityIssue, APIWatchdogReport } from '../../../models/api-watchdog.model';
import { SecurityIssueCardsComponent } from './security-issue-cards/security-issue-cards.component';
import { ApiService } from '../../core/service/api.service';

@Component({
  selector: 'app-security-insights',
  imports: [SecurityIssueCardsComponent, CommonModule],
  templateUrl: './security-insights.component.html',
  styleUrls: ['./security-insights.component.scss']
})
export class SecurityInsightsComponent implements OnInit {
  securityIssues: SecurityIssue[] = [];
  filteredIssues: SecurityIssue[] = [];
  selectedFilter: string = 'ALL';

  loading = true;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // ✅ Fetch security section from backend report
    this.apiService.getReport().subscribe({
      next: (report: APIWatchdogReport) => {
        this.securityIssues = report.security.issues ?? [];
        this.applyFilter();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Failed to load security issues:', err);
        this.error = 'Could not load security insights';
        this.loading = false;
      }
    });
  }

  toggleFilter(filter: string): void {
    this.selectedFilter = filter;
    this.applyFilter();
  }

  isSelected(filter: string): boolean {
    return this.selectedFilter === filter;
  }

  private applyFilter(): void {
    if (this.selectedFilter === 'ALL') {
      this.filteredIssues = this.securityIssues;
    } else {
      this.filteredIssues = this.securityIssues.filter(
        issue => issue.severity === this.selectedFilter
      );
    }
  }

  getCount(severity: string): number {
    return this.securityIssues.filter(issue => issue.severity === severity).length;
  }
}
