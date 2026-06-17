import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { EmployeeService } from '../../../../core/services/employee.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
  providers: [DecimalPipe]
})
export class Reports implements OnInit {

  private employeeService = inject(EmployeeService);
  employees: any[] = [];
  generatingReport = false; // Raporun o an yüklenip yüklenmediğini (Loading) tutar.
  generationSuccess = false; // Yeni raporun başarıyla oluşup oluşmadığını kontrol eder.
  private cd = inject(ChangeDetectorRef); //Ekranı Zorla Güncelleme

  availableReports = [
    { name: '2026_Mayis_Maas_Gider_Raporu.pdf', size: '245 KB', date: '28.05.2026', type: 'PDF' },
    { name: 'Q1_Departman_Analiz_Raporu.xlsx', size: '1.2 MB', date: '15.04.2026', type: 'Excel' },
    { name: '2025_Yillik_IK_Genel_Ozet.pdf', size: '4.8 MB', date: '10.01.2026', type: 'PDF' }
  ];

  ngOnInit() {  
    this.loadEmployees();  //Sayfa ekrana çizildiği an ngOnInit tetiklenir ve loadEmployees() fonksiyonunu çalıştırır.
  }

 // 2. LocalStorage yerine Fake API'dan verileri çekiyoruz
  loadEmployees() {
    this.employeeService.getEmployees().subscribe(data => {
      this.employees = data;
      this.cd.detectChanges();
    });
  }

  get totalEmployees(): number {
    return this.employees.length;  //sistemdeki toplam kişi sayısını verir.
  }

  get totalSalary(): number {
    return this.employees.reduce((sum, emp) => sum + Number(emp.salary || 0), 0); //sistemdeki toplam maaş tutarını verir.
  }

  get averageSalary(): number {
    return this.totalEmployees > 0 ? this.totalSalary / this.totalEmployees : 0; //sistemdeki ortalama maaş tutarını verir.
  }

  get departmentStats() {
    const counts: { [key: string]: { count: number, totalSalary: number } } = {};  //bu kısımda departmentStats fonksiyonu, departmanlara göre kişi ve maaş sayılarını hesaplar.
    
    this.employees.forEach(emp => { 
      if (emp.department) {
      if (!counts[emp.department]) {
        counts[emp.department] = { count: 0, totalSalary: 0 }; } // Eğer departman nesnede yoksa ilk kez oluştur
        counts[emp.department].count += 1;
        counts[emp.department].totalSalary += Number(emp.salary || 0);
      }
    });

    return Object.keys(counts).map(name => {
      const stats = counts[name];
      const count = stats.count;
      const totalSalary = stats.totalSalary;
      const averageSalary = count > 0 ? totalSalary / count : 0; // Departman içi ortalama maaş
      const percentage = this.totalEmployees > 0 ? (count / this.totalEmployees) * 100 : 0; // Şirket içi yüzdelik oran
      return { name, count, totalSalary, averageSalary, percentage };
    });
  }

  generateNewReport() {
    this.generatingReport = true;  // 1. Ekranda "Rapor Hazırlanıyor..." animasyonunu/yükleniyor ibaresini açar
    this.generationSuccess = false; //// 2. Başarı uyarısını gizli tutar.
  setTimeout(() => {
    this.generatingReport = false; // 3. Yükleniyor animasyonunu kapatır.
    this.generationSuccess = true; // 4. Yeşil "Raporunuz hazır" mesajını ve animasyonu gösterir.
      
      const newReportName = `CRM_Guncel_Personel_Raporu_${new Date().toLocaleDateString('tr-TR').replace(/\./g, '_')}.xlsx`;
      
      this.availableReports.unshift({
        name: newReportName,
        size: '18 KB',
        date: new Date().toLocaleDateString('tr-TR'),
        type: 'Excel'
      });

      setTimeout(() => {
        this.generationSuccess = false; // Yeşil başar mesajını 4 saniye sonra otomatik gizler.
      }, 4000);
    }, 1500);
  }

  downloadReport(reportName: string) {
    alert(`"${reportName}" başarıyla indirildi.`);
  }
}
