import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './shared/components/sidebar/sidebar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ScrollTopModule } from "primeng/scrolltop";
import { AuthService } from './core/services/auth.service';
import { NgxSpinnerModule } from 'ngx-spinner';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Sidebar,
    ConfirmDialogModule,
    MenubarModule,
    ScrollTopModule,
    NgxSpinnerModule],
  providers: [ConfirmationService],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  authService = inject(AuthService);
}
