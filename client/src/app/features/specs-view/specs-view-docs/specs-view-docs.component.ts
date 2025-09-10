import { Component, Input } from '@angular/core';
import { SpecsApiDocs } from '../../../../models/api-watchdog.model';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-specs-view-docs',
  imports: [NgIf,CommonModule],
  templateUrl: './specs-view-docs.component.html',
  styleUrl: './specs-view-docs.component.scss'
})
export class SpecsViewDocsComponent {
    @Input() apiDocs!: SpecsApiDocs;
  expanded: { [key: number]: boolean } = {};

  toggleExpand(index: number) {
    this.expanded[index] = !this.expanded[index];
  }

  getMethodColor(method: string) {
    switch (method) {
      case 'GET': return 'bg-green-600';
      case 'POST': return 'bg-blue-600';
      case 'PUT': return 'bg-yellow-600';
      case 'DELETE': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  }

   getStatusColor(method: number) {
    switch (method) {
      case 200: return 'text-green-600  bg-green-200';
      case 300: return 'text-blue-600  bg-blue-200';
      case 500: return 'text-yellow-600  bg-yellow-200' ;
      case 400: return 'text-red-600  bg-red-200';
      default: return 'text-gray-600  bg-gray-200';
    }
  }


}
