import { Component, OnInit } from '@angular/core';
import { EndpointDetailsTableComponent } from './endpoint-details-table/endpoint-details-table.component';
import { ApiService } from '../../core/service/api.service'; // adjust path if needed
import { EndpointItem, APIWatchdogReport } from '../../../models/api-watchdog.model';

@Component({
  selector: 'app-endpoint-details',
  imports: [EndpointDetailsTableComponent],
  templateUrl: './endpoint-details.component.html',
  styleUrls: ['./endpoint-details.component.scss']
})
export class EndpointDetailsComponent implements OnInit {
  apiEndpoints: EndpointItem[] = [];
  filteredEndpoints: EndpointItem[] = [];
  selectedMethods: Set<string> = new Set();

  loading = true;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // ✅ Subscribe to report from service
    this.apiService.getReport().subscribe({
      next: (report: APIWatchdogReport) => {
        this.apiEndpoints = report.endpoints.items;
        this.filteredEndpoints = [...this.apiEndpoints];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load endpoints:', err);
        this.error = 'Could not load endpoint details';
        this.loading = false;
      }
    });
  }

  toggleMethod(method: string) {
    if (method === 'ALL') {
      this.selectedMethods.clear();
      this.filteredEndpoints = [...this.apiEndpoints];
      return;
    }

    if (this.selectedMethods.has(method)) {
      this.selectedMethods.delete(method);
    } else {
      this.selectedMethods.add(method);
    }

    this.applyFilter();
  }

  private applyFilter() {
    if (this.selectedMethods.size === 0) {
      this.filteredEndpoints = [...this.apiEndpoints];
    } else {
      this.filteredEndpoints = this.apiEndpoints.filter(ep =>
        this.selectedMethods.has(ep.method)
      );
    }
  }

  isSelected(method: string): boolean {
    if (method === 'ALL') return this.selectedMethods.size === 0;
    return this.selectedMethods.has(method);
  }

  getTotalEndpoints(): number {
    return this.apiEndpoints.length;
  }

  getCountByStatus(status: string): number {
    return this.apiEndpoints.filter(ep => ep.status === status).length;
  }
}
