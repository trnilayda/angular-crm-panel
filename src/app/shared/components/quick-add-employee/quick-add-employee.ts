import { Component, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-quick-add-employee',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './quick-add-employee.html',
  styleUrl: './quick-add-employee.css'
})
export class QuickAddEmployee {
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);

  @Output() employeeAdded = new EventEmitter<void>(); // Çalışan eklendiğinde tetiklenir.

  showAddDialog = false;

  empForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    department: ['', Validators.required],
    salary: [0, [Validators.required, Validators.min(30000)]]
  });

  addEmployee() {  // Çalışan ekleme fonksiyonu
    if (this.empForm.invalid) {
      return;
    }

    const newEmp = {
      name: this.empForm.value.name || '',
      department: this.empForm.value.department || '',
      salary: Number(this.empForm.value.salary || 0)
    };

    this.employeeService.addEmployee(newEmp).subscribe({ // Çalışanı ekler.
      next: () => {
        this.empForm.reset({  // Formu sıfırlar.
          name: '',
          department: '',
          salary: 0
        });
        this.showAddDialog = false; // Dialogu kapatır.
        this.employeeAdded.emit();
      }
    });
  }
}
