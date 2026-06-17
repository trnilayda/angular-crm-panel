import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { AuthService } from './core/services/auth.service'; // Klasör yolundan emin olun

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            isLoggedIn: () => true, // Ana sayfa düzenini açar
            getUserRole: () => 'admin', // Sidebar'ın hata vermesini engeller (Örn: admin döndürsün)
            hasPermission: (roles: string[]) => true // Sidebar içindeki yetki kontrollerini pas geçer
          }
        }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render layout container', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges(); // Tüm alt bileşenleri (Sidebar dahil) render etmeyi dener

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.layout')).toBeTruthy();
  });
});