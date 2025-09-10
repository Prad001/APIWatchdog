import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { APIWatchdogReport } from '../../../models/api-watchdog.model'; // adjust path if needed

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api'; // Express server

  // 🔹 Store report state locally (shared across app)
  private reportSubject = new BehaviorSubject<APIWatchdogReport | null>(null);
  report$ = this.reportSubject.asObservable();

  constructor(private http: HttpClient) {}

  resetReport(): void {
  this.reportSubject.next(null);
}

  /**
   * Upload a file to Express server
   */
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/upload`, formData);
  }

  /**
   * Fetch report from backend and cache it
   */
  getReport(): Observable<APIWatchdogReport> {
    return this.http.get<APIWatchdogReport>(`${this.baseUrl}/report`).pipe(
      tap(report => this.reportSubject.next(report)), // update cache
      shareReplay(1) // share same value across multiple subscribers
    );
  }

  /**
   * Get cached report synchronously (if already loaded)
   */
  getCachedReport(): APIWatchdogReport | null {
    return this.reportSubject.value;
  }

  // in ApiService
isReportValid(): boolean {
  const r = this.reportSubject.value;
  if (!r) return false;
  if ((r as any).error) return false;
  if (!r.meta || !r.endpoints) return false;
  const items = (r.endpoints as any).items;
  return Array.isArray(items) ? items.length > 0 : true;
}

}
