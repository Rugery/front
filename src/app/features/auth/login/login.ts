import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { LoginService } from '../login-service';
import { Router } from '@angular/router';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    FloatLabelModule,
    Toast,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private loginService = inject(LoginService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private messageService = inject(MessageService);

  // Reactive form setup
  form: FormGroup = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  // Function to handle form submission
  onSubmit(): void {
    if (this.form.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Por favor completa todos los campos',
      });
      return;
    }

    const credentials = this.form.value;

    this.loginService.login(credentials).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Login exitoso',
          detail: 'Bienvenido',
        });
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error de login',
          detail: err.error?.message || 'Usuario o contraseña incorrectos',
        });
      },
    });
  }
}
