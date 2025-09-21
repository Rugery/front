import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '../../core/config/constants';
import { IProgress } from './models/IProgress';
import { Observable } from 'rxjs';
import { IInsignia } from './models/IInsignia';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);

  getProgress(userId?: number): Observable<IProgress[]> {
    let url = `${API_BASE_URL}/progress`;
    if (userId != null) {
      url += `?userId=${userId}`;
    }
    return this.http.get<IProgress[]>(url);
  }

  getInsignias(userId?: number): Observable<IInsignia[]> {
    let url = `${API_BASE_URL}/insignias`;
    if (userId != null) {
      url += `?userId=${userId}`;
    }
    return this.http.get<IInsignia[]>(url);
  }
}
