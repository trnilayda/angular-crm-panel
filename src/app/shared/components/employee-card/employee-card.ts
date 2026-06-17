import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-card',
  standalone: true,
  imports: [CommonModule,FormsModule,],
  templateUrl: './employee-card.html',
  styleUrl: './employee-card.css'
})
export class EmployeeCard {

  @Input() employee: any;

  @Output() delete =
    new EventEmitter<number>();

  removeEmployee() {
    this.delete.emit(this.employee.id);
  }

}