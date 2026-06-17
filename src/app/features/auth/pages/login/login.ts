import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';  //ActivatedRoute: Giriş yapmaya çalışılan sayfanın URL'sini öğrenmek için kullanılır. (Giriş yapınca beni buradan atadılar der)
import { AuthService } from '../../../../core/services/auth.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private spinner = inject(NgxSpinnerService);
  private toastr = inject(ToastrService);
  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(private cdr: ChangeDetectorRef) {

  }

  async onSubmit() {

    this.errorMessage = '';
    this.isLoading = false;

    if (!this.username || this.username.trim() === '' || !this.password) {
      this.errorMessage = 'Lütfen kullanıcı adı ve parolayı girin.';
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();

    try {
      const error = await this.authService.login(this.username, this.password);

      if (error) {
        throw new Error(error)
      } else {
        this.spinner.show();
        this.toastr.success('Teste hoşgeldin', 'Giriş Başarılı');

        setTimeout(() => {
          const redirectUrl = this.route.snapshot.queryParams['redirect'];

          if (redirectUrl) {
            this.router.navigateByUrl(redirectUrl).then(() => {
              this.spinner.hide();
            });
          } else {
            const role = this.authService.getUserRole();

            if (role === 'employee') {
              this.router.navigate(['/employees']).then(() => {
                this.spinner.hide();
              });
            } else {
              this.router.navigate(['/']).then(() => {
                this.spinner.hide();
              });
            }
          }
        }, 1500);
      }
    }
    catch (error: any) {
      this.errorMessage = error.message;
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }
}
