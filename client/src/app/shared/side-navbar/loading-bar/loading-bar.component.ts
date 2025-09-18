// loading-bar.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingService } from '../../../core/service/loading.service';
import { Subject, interval, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-loading-bar',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatProgressBarModule],
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.scss']
})
export class LoadingBarComponent implements OnInit, OnDestroy {
  progress = 0;
  visible = false;
  message = 'Uploading file...'; // Default message
  private destroy$ = new Subject<void>();
  private simSub?: Subscription;

  constructor(public loadingService: LoadingService) {}

  ngOnInit(): void {
    this.loadingService.loading$?.pipe(takeUntil(this.destroy$)).subscribe(loading => {
      this.visible = !!loading;

      if (loading) {
        const svcProgress$ = (this.loadingService as any).progress$;
        if (svcProgress$ && typeof svcProgress$.subscribe === 'function') {
          svcProgress$.pipe(takeUntil(this.destroy$)).subscribe((p: number) => {
            this.progress = Math.max(0, Math.min(100, Math.round(p)));
            this.updateMessage(); // Update message when progress changes
          });
        } else {
          this.startSimulatedProgress();
        }
      } else {
        this.finishAndHide();
      }
    });
  }

  private updateMessage() {
    if (this.progress <= 30) {
      this.message = 'Uploading file...';
    } else if (this.progress <= 50) {
      this.message = 'Preparing your content — this may take a few moments';
    } else {
      this.message = 'Analyzing using AI';
    }
  }

  private startSimulatedProgress() {
    this.progress = Math.max(this.progress, 5);
    if (this.simSub) this.simSub.unsubscribe();

    this.simSub = interval(950).pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.progress < 95) {
        const increment = Math.max(1, Math.round(6 - this.progress / 25));
        this.progress = Math.round(Math.min(95, this.progress + Math.random() * increment));
        this.updateMessage(); // Update message during simulation
      } else {
        this.simSub?.unsubscribe();
      }
    });
  }

  private finishAndHide() {
    if (this.simSub) { this.simSub.unsubscribe(); this.simSub = undefined; }
    this.progress = 100;
    setTimeout(() => {
      this.visible = false;
      this.progress = 0;
      this.message = 'Uploading file...'; // Reset message
    }, 450);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.simSub) this.simSub.unsubscribe();
  }
}