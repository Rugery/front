import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { Toast } from 'primeng/toast';
import { LoginService } from '../../auth/login-service';

@Component({
    selector: 'app-layout',
    imports: [MenubarModule, RouterModule, ButtonModule, Toast],
    templateUrl: './layout.html',
    styleUrl: './layout.css',
})
export class LayoutComponent {
    private loginService = inject(LoginService);
    role = localStorage.getItem('role');
    ifAdmin = this.role === 'ADMIN';
    adminItems = [
        {
            label: 'Modulos',
            icon: 'pi pi-th-large',
            routerLink: '/modules',
        },

        {
            label: 'Cursos',
            icon: 'pi pi-book',
            routerLink: '/adminCourseModules',
        },
    ];

    items = [
        {
            label: 'Perfil',
            icon: 'pi pi-user',
            routerLink: '/profile',
        },
        ...(this.ifAdmin
            ? [
                  {
                      label: 'Administración',
                      icon: 'pi pi-th-large',
                      items: this.adminItems,
                  },
              ]
            : []),
        {
            label: 'Capacitaciones',
            icon: 'pi pi-graduation-cap',
            routerLink: '/courses',
        },
    ];

    confirmLogout() {
        this.loginService.logout();
    }
}
