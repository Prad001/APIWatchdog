import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { ApiService } from '../../core/service/api.service';
import { ConfirmDialogComponent } from '../dialog/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-side-navbar',
  imports: [ RouterModule,CommonModule],
  templateUrl: './side-navbar.component.html',
  styleUrl: './side-navbar.component.scss',
  standalone:true,
})
export class SideNavbarComponent {
  @Output() sidenavClosed = new EventEmitter<void>();

  activeLink: string = '';
  isTitle: string = '';
  private routerSubscription: Subscription = new Subscription();

  constructor(private router: Router, private apiService: ApiService, private dialog: MatDialog) {}

  ngOnInit(): void {
    // Subscribe to route changes
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setActiveLinkBasedOnRoute();
      });

    // Set the active link on initial load
    this.setActiveLinkBasedOnRoute();
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // setActiveLinkBasedOnRoute(): void {
  //   const currentUrl = this.router.url;

    
  //     if (currentUrl.includes('endpoint-details')) {
  //       this.setActiveLink('endpointDetails');
  //     } else if (currentUrl.includes('specs-view')) {
  //       this.setActiveLink('specsView');
  //     } else if (this.router.url.startsWith('flow')) {
  //       this.setActiveLink('flow');
  //     } else if (currentUrl.includes('security-insights')) {
  //       this.setActiveLink('securityInsights');
  //     } else if (currentUrl.includes('full-report')) {
  //       this.setActiveLink('fullReport');
  //     }
  //     //this.isTitle = 'Adaptive Access Control';
    

  // }

  setActiveLinkBasedOnRoute(): void {
  const currentUrl = this.router.url;

  if (currentUrl.includes('/endpoint-details')) {
    this.setActiveLink('endpointDetails');
  } else if (currentUrl.includes('/specs-view')) {
    this.setActiveLink('specsView');
  } else if (currentUrl.includes('/flow')) {
    this.setActiveLink('flow');
  } else if (currentUrl.includes('/security-insights')) {
    this.setActiveLink('securityInsights');
  } else if (currentUrl.includes('/full-report')) {
    this.setActiveLink('fullReport');
  }
}


  setActiveLink(link: string): void {
    this.activeLink = link;
  }

  // isUserDropdownOpen: boolean = false;

  // toggleUserDropdown(): void {
  //   this.isUserDropdownOpen = !this.isUserDropdownOpen;
  // }

  //Admin

  endpointDetails(){
     this.router.navigate(['features/endpoint-details']);
  }

  specsView() {
    this.router.navigate(['features/specs-view']);
  }

  flow(){
    this.router.navigate(['features/flow']);
  }

  securityInsights(){
    this.router.navigate(['features/security-insights']);
  }

 
  fullReport(){
    this.router.navigate(['features/full-report']);
  }
    
  

  isAdminRouteNavbar(): boolean {
    const url = this.router.url;
    return url.startsWith('/admin');
  }


  closeSidenav() {
    this.sidenavClosed.emit();
  }

back() {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '400px',
    data: { message: 'You will lose all unsaved data if you go back. Do you want to continue?' }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      this.apiService.resetReport();
      this.router.navigate(['']);
    }
  });
}
}
