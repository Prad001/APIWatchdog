import { CommonModule } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

export type SnackType = 'success' | 'error' | 'info';
@Component({
  selector: 'app-snack-message',
  imports: [CommonModule],
  templateUrl: './snack-message.component.html',
  styleUrl: './snack-message.component.scss',
  encapsulation: ViewEncapsulation.None   // <-- makes styles global
})
export class SnackMessageComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string; type: SnackType }) {}
}
