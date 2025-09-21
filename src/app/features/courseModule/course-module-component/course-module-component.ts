import { Component, inject, OnInit } from '@angular/core';
import { CourseModuleService } from '../course-module-service';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-course-module-component',
    imports: [AccordionModule, ButtonModule, TableModule],
    templateUrl: './course-module-component.html',
    styleUrl: './course-module-component.css',
})
export class CourseModuleComponent implements OnInit {
    private moduleService = inject(CourseModuleService);
    private messageService = inject(MessageService);
    modules: any[] = [];
    userId: number = 0;
    statusMap: Record<string, string> = {
        NOT_STARTED: 'No iniciado',
        IN_PROGRESS: 'Iniciado',
        COMPLETED: 'Completado',
    };

    ngOnInit() {
        const storedUserId = localStorage.getItem('userId');
        if (!storedUserId) {
            return;
        }
        this.userId = +storedUserId;
        this.loadModules();
    }

    loadModules() {
        this.moduleService.getModules().subscribe((modules) => {
            this.modules = modules;
            this.modules.forEach((module) => {
                module.courses.forEach((course: any) => {
                    this.moduleService
                        .getProgressByUserAndCourse(this.userId, course.id)
                        .subscribe((progress) => {
                            course.progress = progress;
                            course.status = progress?.status || 'NOT_STARTED';
                        });
                });
            });
        });
    }

    updateStatus(course: any, newStatus: string) {
        if (!this.userId || !course.id) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'userId o courseId no definidos',
            });
            return;
        }

        this.moduleService.getProgressByUserAndCourse(this.userId, course.id).subscribe({
            next: (progress: any) => {
                const progressPayload = {
                    ...(progress || { user: { id: this.userId }, course: { id: course.id } }),
                    status: newStatus,
                    dateUpdated: new Date().toISOString(),
                };

                const progressObservable = progress
                    ? this.moduleService.updateProgress(progress.id, progressPayload)
                    : this.moduleService.createProgress(progressPayload);

                progressObservable.subscribe({
                    next: (res: any) => {
                        course.progress = res;
                        course.status = newStatus;

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Progreso actualizado',
                            detail: `El progreso del curso "${course.title}" se ha actualizado a ${this.statusMap[newStatus] || newStatus}`,
                        });

                        if (newStatus === 'COMPLETED') {
                            this.createInsignia(course);
                        }
                    },
                    error: (err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error al actualizar progreso',
                            detail: err.error?.message || 'Ocurrió un error inesperado',
                        });
                    },
                });
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error al obtener progreso',
                    detail: err.error?.message || 'Ocurrió un error inesperado',
                });
            },
        });
    }

    private createInsignia(course: any) {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        const insigniaPayload = {
            user: { id: this.userId },
            course: { id: course.id },
            name: `${course.title} - Completado`,
            dateAwarded: formattedDate,
        };

        this.moduleService.createInsignia(insigniaPayload).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Insignia creada',
                    detail: `Has obtenido la insignia de ${course.title}`,
                });
            },
            error: (err) => {
                if (err.status === 400 && err.error?.message?.includes('ya creada')) {
                    console.log(insigniaPayload);
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Insignia existente',
                        detail: `Ya tienes la insignia de ${course.title}`,
                    });
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error al crear insignia',
                        detail: err.error?.message || 'Ocurrió un error inesperado',
                    });
                }
            },
        });
    }
}
