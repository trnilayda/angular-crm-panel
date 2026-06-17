import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authenticationService = inject(AuthService);
  const router = inject(Router);

  return of(authenticationService.isLogged()).pipe(
    tap(result => {
      if (!result) {
        router.navigate(['/login'], {
          queryParams: { redirect: state.url }, // Giriş yapınca yönlendirilecek sayfayı kaydeder
          replaceUrl: true // URL'yi değiştirir, geri dönemez 
        });
      }
    })
  );
};
//authguard =sadece giriş yapmış kullacıları görebilir
//roleguard =izin vrilen rolleri görebilir

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {  //(İzin Verilen Roller): Bu guard'a dışarıdan bir liste verilir. Örneğin Raporlar sayfasının kapısına roleGuard(['admin', 'manager']) yazılır. Yani buraya sadece Admin ve Manager girebilir denir.
  return (route, state) => {
    const authenticationService = inject(AuthService);
    const router = inject(Router);

    return of(authenticationService.isLogged()).pipe(
      tap(result => {
        if (!result) {
          router.navigate(['/login'], {
            queryParams: { redirect: state.url },
            replaceUrl: true
          });
        }
      }),
      // Giriş yapmış ve yetkisi varsa true döndür, yoksa false döndür ve kullanıcıyı yönlendir
      map(result => {
        if (!result) {
          return false;
        }

        const role = authenticationService.getUserRole();
        if (role && allowedRoles.includes(role)) {
          return true;
        }

        // Yetki yetersiz ise kullanıcının rolüne göre gidebileceği sayfaya yönlendir
        if (role === 'employee') {
          router.navigate(['/employees']); // Düz personelsen seni Personel Listesine geri fırlatır
        } else {
          router.navigate(['/']); // Diğer durumlarda ana sayfaya atar
        }
        return false; // Sayfaya girişi kesinlikle engeller!
      })
    );
  };
};
