import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminCourseService, ICourse } from '../admin-course-service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Dialog, DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { Toolbar } from 'primeng/toolbar';
import { ICourseModule } from '../admin-module-service';
import { Select } from 'primeng/select';
import { CourseModuleService } from '../../courseModule/course-module-service';

@Component({
  selector: 'app-admin-course-component',
  imports: [
    ButtonModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    InputTextModule,
    Dialog,
    Toolbar,
    Select,
  ],
  templateUrl: './admin-course-component.html',
  styleUrl: './admin-course-component.css',
})
export class AdminCourseComponent implements OnInit {
  private adminCourseService = inject(AdminCourseService);
  private moduleService = inject(CourseModuleService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  // State signals
  courses = signal<ICourse[]>([]);
  modules = signal<ICourseModule[]>([]);

  displayDialog = false;
  selectedCourse: ICourse | null = null;

  // Reactive form for course
  courseForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    moduleId: new FormControl<number | null>(null, Validators.required),
  });

  ngOnInit(): void {
    this.loadModules();
    this.loadCourses();
  }

  // Load modules for the select
  loadModules() {
    this.moduleService.getModules().subscribe({
      next: (data) => this.modules.set(data),
      error: (err) =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error al cargar módulos',
          detail: err.error?.message || 'Ocurrió un error inesperado',
        }),
    });
  }

  // Load all courses
  loadCourses() {
    this.adminCourseService.getAllCourses().subscribe({
      next: (data) => this.courses.set(data),
      error: (err) =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error al cargar cursos',
          detail: err.error?.message || 'Ocurrió un error inesperado',
        }),
    });
  }

  // Show dialog for create or edit
  showDialog(course?: ICourse) {
    if (course) {
      this.selectedCourse = course;
      this.courseForm.patchValue({
        title: course.title,
        description: course.description,
        moduleId: course.module?.id ?? null,
      });
    } else {
      this.selectedCourse = null;
      this.courseForm.reset();
    }
    this.displayDialog = true;
  }

  // Hide dialog
  hideDialog() {
    this.displayDialog = false;
  }

  // Save or update course
  saveCourse() {
    if (this.courseForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Por favor completa todos los campos requeridos',
      });
      return;
    }

    const payload: ICourse = {
      title: this.courseForm.value.title!,
      description: this.courseForm.value.description!,
      module: { id: this.courseForm.value.moduleId! },
    };

    if (this.selectedCourse) {
      this.adminCourseService.updateCourse(this.selectedCourse.id!, payload).subscribe({
        next: (res) => {
          this.hideDialog();
          this.loadCourses();
          this.messageService.add({
            severity: 'success',
            summary: 'Curso actualizado',
            detail: res.message || 'El curso se actualizó correctamente',
          });
        },
        error: (err) =>
          this.messageService.add({
            severity: 'error',
            summary: 'Error al actualizar',
            detail: err.error?.message || 'Ocurrió un error inesperado',
          }),
      });
    } else {
      this.adminCourseService.createCourse(payload).subscribe({
        next: (res) => {
          this.hideDialog();
          this.loadCourses();
          this.messageService.add({
            severity: 'success',
            summary: 'Curso creado',
            detail: res.message || 'El curso se creó correctamente',
          });
        },
        error: (err) =>
          this.messageService.add({
            severity: 'error',
            summary: 'Error al crear',
            detail: err.error?.message || 'Ocurrió un error inesperado',
          }),
      });
    }
  }

  // Edit course
  editCourse(course: ICourse) {
    this.showDialog(course);
  }

  // Delete course with confirmation
  deleteCourse(course: ICourse) {
    this.confirmationService.confirm({
      message: `¿Desea eliminar el curso "${course.title}"?`,
      accept: () => {
        this.adminCourseService.deleteCourse(course.id!).subscribe({
          next: (res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Curso eliminado',
              detail: res.message || 'El curso se eliminó correctamente',
            });
            this.loadCourses();
          },
          error: (err) =>
            this.messageService.add({
              severity: 'error',
              summary: 'Error al eliminar',
              detail: err.error?.message || 'Ocurrió un error inesperado',
            }),
        });
      },
    });
  }
}
