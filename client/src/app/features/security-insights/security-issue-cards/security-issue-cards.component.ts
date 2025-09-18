import { Component, Input } from '@angular/core';
import { SecurityIssue } from '../../../../models/api-watchdog.model';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-security-issue-cards',
  imports: [CommonModule,NgIf],
  templateUrl: './security-issue-cards.component.html',
  styleUrl: './security-issue-cards.component.scss'
})
export class SecurityIssueCardsComponent {
     @Input() issue!: SecurityIssue;
  expanded = false;

  toggleDetails() {
    this.expanded = !this.expanded;
  }

  get severityColor(): string {
    switch (this.issue.severity) {
      case 'High':
        return 'bg-red-600 text-gray-900';
      case 'Medium':
        return 'bg-yellow-500 text-gray-900';
      case 'Low':
        return 'bg-blue-600 text-gray-900';
      default:
        return 'bg-gray-400 text-gray-900';
    }
  }
  
}
