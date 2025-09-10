import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '../../../core/service/loading.service';

@Component({
  selector: 'app-loading-bar',
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './loading-bar.component.html',
  styleUrl: './loading-bar.component.scss'
})
export class LoadingBarComponent {
  constructor(public loadingService: LoadingService) {}
}
