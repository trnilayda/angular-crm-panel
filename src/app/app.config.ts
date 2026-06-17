/* main application ayarları */
import { ApplicationConfig }from '@angular/core';
/* animasyonlar */
import { provideAnimationsAsync }from '@angular/platform-browser/animations/async';
/* butonlar vs için gerekli  */
import { providePrimeNG }from 'primeng/config';
/* renkleri belirleyen tema  */
import Aura from '@primeng/themes/aura';
/* sayfa yönlendirmesi  */
import { provideRouter }from '@angular/router';
import { routes }from './app.routes';
/*tema rengini aura temasına göre belirliyor */
import { definePreset }from '@primeng/themes';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';

/* bir temayı alıp onun üstüne istediğin ayarları ekleyebilmenizi sağlayan yapı */
const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}'
    }
  }
});

/*burası ana uygulama ayarları */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: false || 'none',
          cssLayer: {
            name: 'primeng',
            order: 'tailwind-base, primeng, tailwind-utilities'
          }
        }
      }
    })
  ]
};