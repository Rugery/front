import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/constants';

// Course interface
export interface ICourse {
  id?: number;
  title: string;
  description: string;
  message?: string;
  module: { id: number };
}

@Injectable({
  providedIn: 'root',
})
export class AdminCourseService {
  private http = inject(HttpClient);

  // Fetch all courses
  getAllCourses(): Observable<ICourse[]> {
    return this.http.get<ICourse[]>(`${API_BASE_URL}/courses`);
  }

  // Create a new course
  createCourse(course: ICourse): Observable<ICourse> {
    return this.http.post<ICourse>(`${API_BASE_URL}/courses/create`, course);
  }

  // Update an existing course
  updateCourse(id: number, course: ICourse): Observable<ICourse> {
    return this.http.put<ICourse>(`${API_BASE_URL}/courses/update/${id}`, course);
  }

  // Delete a course
  deleteCourse(id: number): Observable<ICourse> {
    return this.http.delete<ICourse>(`${API_BASE_URL}/courses/delete/${id}`);
  }
}
