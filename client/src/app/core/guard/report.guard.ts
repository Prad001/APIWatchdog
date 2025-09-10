import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take, timeoutWith, startWith } from 'rxjs/operators';
import { ApiService } from '../service/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReportGuard implements CanActivate {
  // timeoutMs: how long to wait for report$ to emit a valid report (adjust if needed)
  private timeoutMs = 5000;

  constructor(private api: ApiService, private router: Router) {}

  private isValidReport(report: any): boolean {
    if (!report) return false;
    if (report.error) return false;
    // basic shape checks — adapt to your interface if you need stricter validation
    if (!report.meta || !report.endpoints) return false;
    const items = (report.endpoints as any).items;
    return Array.isArray(items) ? items.length > 0 : true;
  }

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Start with current cached value (if any), then listen to report$
    return this.api.report$.pipe(
      startWith(this.api.getCachedReport()),         // immediately check cached value too
      map(report => this.isValidReport(report)),     // map to boolean
      timeoutWith(this.timeoutMs, of(false)),        // wait up to timeoutMs for value, else false
      take(1),                                       // take single result
      map(valid => {
        if (valid) return true;
        // redirect to home and add flag so HomeComponent can display a message
        return this.router.createUrlTree(['/'], { queryParams: { reportInvalid: '1' } });
      })
    );
  }
}
