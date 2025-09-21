import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/constants';
import { ICourseModule } from '../adminModule/admin-module-service';
import { IProgress } from '../profile/models/IProgress';
import { IInsignia } from '../profile/models/IInsignia';

@Injectable({
  providedIn: 'root',
})
export class CourseModuleService {
  private http = inject(HttpClient);

  getModules(): Observable<ICourseModule[]> {
    return this.http.get<ICourseModule[]>(`${API_BASE_URL}/course-modules`);
  }

  getModulesForUser(userId: number): Observable<ICourseModule[]> {
    return this.http.get<ICourseModule[]>(`${API_BASE_URL}/courses?userId=${userId}`);
  }

  createProgress(progress: any): Observable<IProgress> {
    return this.http.post<IProgress>(`${API_BASE_URL}/progress/create`, progress);
  }

  updateProgress(progressId: number, progress: any): Observable<IProgress> {
    return this.http.put<IProgress>(`${API_BASE_URL}/progress/update/${progressId}`, progress);
  }

  createInsignia(insignia: any): Observable<IInsignia> {
    return this.http.post<IInsignia>(`${API_BASE_URL}/insignias/create`, insignia);
  }

  getProgressByUserAndCourse(userId: number, courseId: number): Observable<IProgress> {
    return this.http.get<IProgress>(`${API_BASE_URL}/progress/user/${userId}/course/${courseId}`);
  }
}
