import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QuickAddEmployee } from '../../../../shared/components/quick-add-employee/quick-add-employee';
import { EmployeeService, Employee } from '../../../../core/services/employee.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, QuickAddEmployee],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private employeeService = inject(EmployeeService);
  employees: Employee[] = [];
  private cd = inject(ChangeDetectorRef);
  authService = inject(AuthService);

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe(data => {
      this.employees = data;
      this.cd.detectChanges();
    });
  }

  get totalEmployees(): number {
    return this.employees.length; // Toplam çalışan sayısını döndürür.
  }

  get totalSalary(): number {
    return this.employees.reduce((sum, emp) => sum + Number(emp.salary || 0), 0); // Toplam maaşı döndürür.
  }

  get averageSalary(): number {
    return this.totalEmployees > 0 // Çalışan sayısı 0'dan büyükse
      ? this.totalSalary / this.totalEmployees // Toplam maaşı toplam çalışan sayısına böler.
      : 0; // Çalışan sayısı 0'dan büyük değilse 0 döndürür.
  }

  get departmentCount(): number {
    const depts = this.employees.map(emp => emp.department); // Departmanları çeker.
    return new Set(depts).size; // Departmanları unique yapar ve sayısını döndürür.
  }

  get departmentStats() {
    const counts: { [key: string]: number } = {}; // Departman sayılarını tutar.

    this.employees.forEach(emp => {
      if (emp.department) {
        counts[emp.department] = (counts[emp.department] || 0) + 1; // Departmanları sayar.
      }
    });

    return Object.keys(counts).map(name => {
      const count = counts[name]; // Departman sayısını alır.
      const percentage = this.totalEmployees > 0 ? (count / this.totalEmployees) * 100 : 0; // Yüzdeyi hesaplar.

      return {
        name,
        count,
        percentage
      };
    });
  }

}