// spec-view.component.ts (updated)
import { Component, OnInit } from '@angular/core';
import { SpecsViewDocsComponent } from './specs-view-docs/specs-view-docs.component';
import { ApiService } from '../../core/service/api.service';
import { SpecsApiDocs, APIWatchdogReport } from '../../../models/api-watchdog.model';
import * as yaml from 'js-yaml';
import { NgIf } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackMessageComponent } from '../../shared/snack-message/snack-message.component';

@Component({
  selector: 'app-specs-view',
  imports: [SpecsViewDocsComponent, NgIf],
  templateUrl: './specs-view.component.html',
  styleUrls: ['./specs-view.component.scss']
})
export class SpecsViewComponent implements OnInit {
  apiDocs: SpecsApiDocs | null = null;   // ✅ no @Input()

  loading = true;
  error: string | null = null;

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar      // <-- injected snack bar
  ) {}

  ngOnInit(): void {
    this.apiService.getReport().subscribe({
      next: (report: APIWatchdogReport) => {
        this.apiDocs = report.spec;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Failed to load API specs:', err);
        this.error = 'Could not load API specification';
        this.loading = false;
      }
    });
  }

  get endpointsCount(): number {
    return this.apiDocs?.endpoints.length ?? 0;
  }

  get parametersCount(): number {
    return this.apiDocs?.endpoints.reduce(
      (acc, ep) => acc + (ep.parameters?.length || 0),
      0
    ) ?? 0;
  }

  get coverage(): number {
    if (!this.apiDocs || !this.apiDocs.endpoints.length) return 0;

    const covered = this.apiDocs.endpoints.filter(
      ep => (ep.responses?.length ?? 0) > 0
    ).length;

    return Math.round((covered / this.apiDocs.endpoints.length) * 100);
  }

  downloadYAML() {
    if (!this.apiDocs) return;
    const yamlSpec = yaml.dump(this.apiDocs);
    const blob = new Blob([yamlSpec], { type: 'application/x-yaml' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'openapi-spec.yaml';
    a.click();

    window.URL.revokeObjectURL(url);
  }

  async copySpec() {
    if (!this.apiDocs) {
      // this.snackBar.open('No spec available to copy.', 'OK', { duration: 3000, verticalPosition: 'top' });
      // return;
       this.snackBar.openFromComponent(SnackMessageComponent, {
              data: { message: 'No spec available to copy.', type: 'error' },
              duration: 3000,
              verticalPosition: 'top',
              panelClass: ['snack-error']
            });
            return;
    }

    // Prefer specScript if present (plain YAML/text). Fallback: dump YAML of whole apiDocs.
    const textToCopy = (this.apiDocs as any).specScript && typeof (this.apiDocs as any).specScript === 'string'
      ? (this.apiDocs as any).specScript
      : yaml.dump(this.apiDocs);

    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        // fallback for environments without clipboard API
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      } else {
        await navigator.clipboard.writeText(textToCopy);
      }

      // this.snackBar.open('Spec script copied to clipboard ✅', 'OK', { duration: 3000, verticalPosition: 'top' });
       this.snackBar.openFromComponent(SnackMessageComponent, {
              data: { message: 'Spec script copied to clipboard.', type: 'success' },
              duration: 3000,
              verticalPosition: 'top',
              panelClass: ['snack-success']
            });
      
      console.log('✅ Spec script copied to clipboard');
    } catch (err) {
      console.error('❌ Failed to copy spec script:', err);
      this.snackBar.open('Failed to copy spec. Try again.', 'Close', { duration: 3000, verticalPosition: 'top' });
    }
  }
}
