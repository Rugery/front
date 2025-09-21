import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/constants';

// Course Module interface
export interface ICourseModule {
  id?: number;
  title: string;
  description: string;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminModuleService {
  private http = inject(HttpClient);

  // Fetch all course modules
  getAllModules(): Observable<ICourseModule[]> {
    return this.http.get<ICourseModule[]>(`${API_BASE_URL}/course-modules`);
  }

  // Create a new course module
  createModule(module: ICourseModule): Observable<ICourseModule> {
    return this.http.post<ICourseModule>(`${API_BASE_URL}/course-modules/create`, module);
  }

  // Update an existing course module
  updateModule(id: number, module: ICourseModule): Observable<ICourseModule> {
    return this.http.put<ICourseModule>(`${API_BASE_URL}/course-modules/update/${id}`, module);
  }

  // Delete a course module
  deleteModule(id: number): Observable<ICourseModule> {
    return this.http.delete<ICourseModule>(`${API_BASE_URL}/course-modules/delete/${id}`);
  }
}
