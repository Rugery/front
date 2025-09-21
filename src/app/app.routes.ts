import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { LayoutComponent } from './features/share/layout/layout';
import { ProfileComponent } from './features/profile/profile-component/profile-component';
import { CourseModuleComponent } from './features/courseModule/course-module-component/course-module-component';
import { AdminModuleComponent } from './features/adminModule/admin-module-component/admin-module-component';
import { AdminCourseComponent } from './features/adminModule/admin-course-component/admin-course-component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: 'profile', component: ProfileComponent },
            { path: 'courses', component: CourseModuleComponent },
            { path: 'modules', component: AdminModuleComponent },
            { path: 'adminCourseModules', component: AdminCourseComponent },
            { path: '', redirectTo: 'profile', pathMatch: 'full' },
        ],
    },
    { path: '**', redirectTo: '' },
];
