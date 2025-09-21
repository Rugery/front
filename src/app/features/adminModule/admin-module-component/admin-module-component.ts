import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminModuleService, ICourseModule } from '../admin-module-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Dialog, DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { Toolbar } from 'primeng/toolbar';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-admin-module-component',
  imports: [
    ButtonModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    InputTextModule,
    Dialog,
    Toolbar,
    Toast,
  ],
  templateUrl: './admin-module-component.html',
  styleUrl: './admin-module-component.css',
  providers: [ConfirmationService, MessageService],
})
export class AdminModuleComponent implements OnInit {
  private adminModuleService = inject(AdminModuleService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  // State signals
  modules = signal<ICourseModule[]>([]);
  displayDialog: boolean = false;
  editingModule = signal<ICourseModule | null>(null);

  // Reactive form for module
  moduleForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.loadModules();
  }

  // Load all modules
  loadModules() {
    this.adminModuleService.getAllModules().subscribe((data) => {
      this.modules.set(data);
    });
  }

  // Edit an existing module
  editModule(module: ICourseModule) {
    this.editingModule.set(module);
    this.moduleForm.patchValue({
      title: module.title,
      description: module.description,
    });
    this.displayDialog = true;
  }

  // Remove a module
  deleteModule(module: ICourseModule) {
    this.confirmationService.confirm({
      message: `¿Desea eliminar el módulo "${module.title}"?`,
      accept: () => {
        this.adminModuleService.deleteModule(module.id!).subscribe({
          next: (res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: res.message || 'El módulo se eliminó correctamente',
            });
            this.loadModules();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error al eliminar',
              detail: err.error?.message || 'Ocurrió un error inesperado',
            });
          },
        });
      },
    });
  }

  // Save (create or update) a module
  saveModule() {
    if (this.moduleForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Por favor completa todos los campos requeridos',
      });
      return;
    }

    const moduleData: ICourseModule = {
      title: this.moduleForm.value.title ?? '',
      description: this.moduleForm.value.description ?? '',
    };

    if (this.editingModule() != null) {
      this.adminModuleService.updateModule(this.editingModule()!.id!, moduleData).subscribe({
        next: (res) => {
          this.hideDialog();
          this.loadModules();
          this.messageService.add({
            severity: 'success',
            summary: 'Módulo actualizado',
            detail: res.message || 'El módulo se actualizó correctamente',
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al actualizar',
            detail: err.error?.message || 'Ocurrió un error inesperado',
          });
        },
      });
    } else {
      this.adminModuleService.createModule(moduleData).subscribe({
        next: (res) => {
          this.hideDialog();
          this.loadModules();
          this.messageService.add({
            severity: 'success',
            summary: 'Módulo creado',
            detail: res.message || 'El módulo se creó correctamente',
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al crear',
            detail: err.error?.message || 'Ocurrió un error inesperado',
          });
        },
      });
    }
  }

  // Show and hide dialog
  showDialog() {
    this.editingModule.set(null);
    this.moduleForm.reset();
    this.displayDialog = true;
  }

  // Hide dialog
  hideDialog() {
    this.displayDialog = false;
  }
}
