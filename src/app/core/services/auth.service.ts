import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from './employee.service';
import { firstValueFrom } from 'rxjs';

export interface User {   //export interface User: Bu satır, TypeScript'e "Kullanıcı şu özelliklere sahip olacak" diyen bir sözleşme (plan) hazırlar. 
  username: string;
  role: 'admin' | 'manager' | 'employee';
  employeeName?: string; // Çalışan rolü için isim tutuyor
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private employeeService = inject(EmployeeService);
  private router = inject(Router);

  // Oturum durumu için Signal kullanıyoruz
  currentUser = signal<User | null>(null);

  constructor() {
    this.loadSession();
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  isLogged(): boolean {
    return this.isLoggedIn();
  }

  getUserRole(): 'admin' | 'manager' | 'employee' | null {
    const user = this.currentUser();
    return user ? user.role : null;
  }

  /**
    hasPermission(allowedRoles: string[] | string): boolean {
      const role = this.getUserRole();
      if (!role) return false;
      if (Array.isArray(allowedRoles)) {
        return allowedRoles.includes(role);
      }
      return role === allowedRoles;
    }*/


  getUserName(): string {
    const user = this.currentUser();
    if (!user) return '';
    if (user.role === 'admin') return 'Yönetici';
    if (user.role === 'manager') return 'Müdür';
    return user.employeeName || user.username;
  }

  async login(username: string, password: string): Promise<string | null> {     //bu metodu login.ts de kullanıyoruz, burası login.ts için gerekli 
    if (password !== '1234') {
      return 'Hatalı şifre! (Geliştirme aşaması şifresi: 1234)';
    }

    const cleanUsername = username;

    if (cleanUsername === 'admin') {
      const user: User = { username: 'admin', role: 'admin' };
      this.setCurrentUser(user);
      return null; // Başarılı
    }

    if (cleanUsername === 'manager' || cleanUsername === 'müdür' || cleanUsername === 'mudur') {
      const user: User = { username: 'manager', role: 'manager' };
      this.setCurrentUser(user);
      return null; // Başarılı
    }

    // Çalışan listesinden isim eşleşmesi kontrol ediliyor
    try {
      const employees = await firstValueFrom(this.employeeService.getEmployees());
      console.log(employees)
      const matchedEmployee = employees.find(
        emp => emp.name === cleanUsername
      );

      if (matchedEmployee) {
        const user: User = {
          username: matchedEmployee.name,
          role: 'employee',
          employeeName: matchedEmployee.name
        };
        this.setCurrentUser(user);
        return null; // Başarılı
      }
      console.log("matchedEmployee", matchedEmployee);

    } catch (error) {
      console.error('Çalışan listesi yüklenemedi, veritabanı bağlantısı yok veya servis hatalı.', error);
    }

    return 'Kullanıcı bulunamadı. Lütfen "admin", "manager" veya kayıtlı bir personel ismi girin.';
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('crm_user');
    this.router.navigate(['/login']);
  }

  private setCurrentUser(user: User) {
    this.currentUser.set(user);
    localStorage.setItem('crm_user', JSON.stringify(user));
  }

  private loadSession() {
    const saved = localStorage.getItem('crm_user');
    if (saved) {
      try {
        const user = JSON.parse(saved);
        this.currentUser.set(user);
      } catch (e) {
        localStorage.removeItem('crm_user');
      }
    }
  }
}
