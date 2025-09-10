import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../core/service/api.service'; // adjust path if needed
import { SnackMessageComponent } from '../shared/snack-message/snack-message.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    NgIf,
    MatSnackBarModule         // needed for MatSnackBar usage in standalone component
    // the custom snack component you created
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  uploadedFileName: string | null = null;
  isUploading = false;

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Show message when guard redirected with ?reportInvalid=1
    this.route.queryParams.subscribe(params => {
      if (params['reportInvalid']) {
        this.snackBar.openFromComponent(SnackMessageComponent, {
          data: { message: 'Please upload a file with valid format before accessing features.', type: 'info' },
          duration: 4000,
          verticalPosition: 'top',
          panelClass: ['snack-info'] // optional wrapper class; adjust as needed
        });
        // remove the param so it doesn't repeat on refresh/navigation
        this.router.navigate([], { queryParams: { reportInvalid: null }, queryParamsHandling: 'merge' });
      }
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    this.handleFile(file);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.handleFile(file);

    // 🔑 reset so same file can be re-uploaded
    input.value = '';
  }

  handleFile(file: File | undefined) {
    if (!file) return;

    const allowedTypes = ['.json', '.har', '.log', '.txt']; // added .txt
    const isValid = allowedTypes.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!isValid) {
      this.snackBar.openFromComponent(SnackMessageComponent, {
        data: { message: 'Invalid file type. Only .json, .har, .log, .txt allowed.', type: 'error' },
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['snack-error']
      });
      return;
    }

    this.isUploading = true;

    // upload to backend
    this.apiService.uploadFile(file).subscribe({
      next: (res) => {
        this.isUploading = false;

        // Show the file name ONLY after successful upload
        this.uploadedFileName = file.name;

        this.snackBar.openFromComponent(SnackMessageComponent, {
          data: { message: `File uploaded & processed: ${file.name}`, type: 'success' },
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['snack-success']
        });

        console.log('Server response:', res);

        // fetch the processed report and cache it
        this.apiService.getReport().subscribe(report => {
          console.log('📄 Cached report:', report);
        });
      },
      error: (err) => {
        this.isUploading = false;
        this.uploadedFileName = null;

        console.error('Upload error:', err);
        this.snackBar.openFromComponent(SnackMessageComponent, {
          data: { message: 'Upload failed. Please try again.', type: 'error' },
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['snack-error']
        });

        // reset file input so retry works with same file
        const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
        if (fileInput) fileInput.value = '';
      }
    });
  }

  getFullReport() {
    this.router.navigate(['features/full-report']);
  }

  getDiscoverEndpoints() {
    this.router.navigate(['features/endpoint-details']);
  }

  getGenerateSpecs() {
    this.router.navigate(['features/specs-view']);
  }

  getVisualizeFlows() {
    this.router.navigate(['features/flow']);
  }

  getSecurityInsights() {
    this.router.navigate(['features/security-insights']);
  }
}
