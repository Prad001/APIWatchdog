import { Component, Input } from '@angular/core';
import { ApiEndpoint } from '../../../../models/api-endpoint';
 import { NgIf } from '@angular/common';
 import { CommonModule } from '@angular/common'; 
import { EndpointItem } from '../../../../models/api-watchdog.model';
@Component({
  selector: 'app-endpoint-details-table',
  imports: [NgIf,CommonModule],
  templateUrl: './endpoint-details-table.component.html',
  styleUrl: './endpoint-details-table.component.scss'
})
export class EndpointDetailsTableComponent {
     @Input() endpoints: EndpointItem[] = [];
  expandedIndex: number | null = null;

  toggleExpand(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  getMethodColor(method: string): string {
    switch (method) {
      case 'GET': return 'bg-green-600';
      case 'POST': return 'bg-blue-600';
      case 'PUT': return 'bg-yellow-600';
      case 'DELETE': return 'bg-red-600';
      case 'PATCH': return 'bg-purple-600';
      default: return 'bg-gray-500';
    }
  }

  getStatusIcon(status: string): string {
  switch (status) {
    case 'success': return 'success';
    case 'warning': return 'warning';
    case 'error':   return 'error';
    default:  return 'info';
  }
}

}
