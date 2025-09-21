import { Component, inject, OnInit } from '@angular/core';
import { ProfileService } from '../profile-service';
import { IInsignia } from '../models/IInsignia';
import { IProgress } from '../models/IProgress';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-profile-component',
    imports: [TableModule, CardModule, DatePipe, ButtonModule],
    templateUrl: './profile-component.html',
    styleUrl: './profile-component.css',
})
export class ProfileComponent implements OnInit {
    private profileService = inject(ProfileService);

    progress: IProgress[] = [];
    insignias: IInsignia[] = [];

    ngOnInit(): void {
        const userId = Number(localStorage.getItem('userId'));

        this.loadProgress(userId);
        this.loadInsignias(userId);
    }

    private loadProgress(userId: number): void {
        this.profileService.getProgress(userId).subscribe({
            next: (result) => (this.progress = result),
            error: (err) => console.error('Error cargando progresos:', err),
        });
    }

    private loadInsignias(userId: number): void {
        this.profileService.getInsignias(userId).subscribe({
            next: (result) => (this.insignias = result),
            error: (err) => console.error('Error cargando insignias:', err),
        });
    }
}
