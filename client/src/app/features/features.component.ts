import { Component } from '@angular/core';
import { SideNavbarComponent } from '../shared/side-navbar/side-navbar.component';
import { CommonModule } from '@angular/common';
import { featuresRouter, featuresRoutes } from './features.router';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-features',
  imports: [ SideNavbarComponent, CommonModule, RouterOutlet],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss'
})
export class FeaturesComponent {
  isSidenavOpen: boolean = true; // default open
ngOnInit() {
  document.body.classList.add('features-bg');
}
ngOnDestroy() {
  document.body.classList.remove('features-bg');
}

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }
}

