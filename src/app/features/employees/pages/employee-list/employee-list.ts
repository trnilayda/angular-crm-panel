import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import { EmployeeService, Employee } from '../../../../core/services/employee.service';
import { AuthService } from '../../../../core/services/auth.service';


@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    FormsModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
  providers: [ConfirmationService]
})

export class EmployeeList implements OnInit {
  private fb = inject(FormBuilder);
  private confirmationService = inject(ConfirmationService);
  private employeeService = inject(EmployeeService);
  private cd = inject(ChangeDetectorRef);
  authService = inject(AuthService);

  employees: Employee[] = [];

  showAddDialog = false;
  showSearchDialog = false;
  searchText = '';

  // Yeni Reactive Form yapımız
  empForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    department: ['', Validators.required],
    salary: [0, [Validators.required, Validators.min(1)]]
  });

  constructor() { }

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe(data => {
      const currentUser = this.authService.currentUser();
      if (currentUser && currentUser.role === 'employee' && currentUser.employeeName) {
        // Personel sadece kendi ismine ait kaydı görsün
        this.employees = data.filter(
          emp => emp.name.trim().toLowerCase() === currentUser.employeeName!.trim().toLowerCase()
        );
      } else {
        this.employees = data;
      }
      this.cd.detectChanges();
    });
  }

  get totalEmployees(): number {
    return this.employees.length;
  }

  get totalSalary(): number {
    return this.employees.reduce((sum, emp) => sum + Number(emp.salary || 0), 0);
  }

  get averageSalary(): number {
    return this.totalEmployees > 0 ? this.totalSalary / this.totalEmployees : 0;
  }

  get departmentCount(): number {
    // Benzersiz departman isimlerini filtreleyip sayısını bulur
    const depts = this.employees.map(emp => emp.department);
    return new Set(depts).size;
  }

  // 4. SAĞ TARAFTAKİ GRAFİKLERİN ÇALIŞMASI İÇİN GEREKLİ DEĞİŞKEN:
  get departmentStats() {
    const counts: { [key: string]: number } = {};

    // Departman sayılarını hesapla
    this.employees.forEach(emp => {
      if (emp.department) {
        counts[emp.department] = (counts[emp.department] || 0) + 1;
      }
    });

    // Yüzdelerini hesapla ve listeye çevir
    return Object.keys(counts).map(name => {
      const count = counts[name];
      const percentage = this.totalEmployees > 0 ? (count / this.totalEmployees) * 100 : 0;
      return { name, count, percentage };
    });
  }

  get filteredEmployees() {
    return this.employees.filter((employee: any) =>
      employee.name?.toLowerCase().includes(this.searchText?.toLowerCase() || '')
    );
  }

  addEmployee() {
    if (this.empForm.invalid) {
      return;
    }

    var nextId = this.employees.length > 0
      ? Math.max(...this.employees.map(e => Number(e.id) || 0)) + 1
      : 1;
    console.log(nextId);

    const newEmp = {
      id: nextId,
      name: this.empForm.value.name || '',
      department: this.empForm.value.department || '',
      salary: Number(this.empForm.value.salary || 0)
    };

    this.employeeService.addEmployee(newEmp).subscribe({
      next: () => {
        this.loadEmployees();
        this.empForm.reset({
          name: '',
          department: '',
          salary: 0
        });
        this.showAddDialog = false;
      }
    });
  }

  deleteEmployee(employee: any) {
    this.confirmationService.confirm({
      message: `${employee.name} adlı personeli silmek istediğinize emin misiniz?`,
      header: 'Silme Onayı',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (employee.id !== undefined) {
          this.employeeService.deleteEmployee(employee.id).subscribe({
            next: () => {
              this.loadEmployees();
            }
          });
        }
      }
    });
  }
}

