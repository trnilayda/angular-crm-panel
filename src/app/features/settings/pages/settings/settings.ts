import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit {
  companyName = 'Antigravity Teknoloji A.Ş.';
  currency = 'TRY';
  emailNotifications = true;
  smsNotifications = false;
  systemAlerts = true;
  autoBackup = false;

  // Monthly Summary Report Settings
  monthlyReportEnabled = true;
  monthlyReportDate = '2026-06-30';
  monthlyReportFormat = 'PDF';
  monthlyReportEmail = 'yonetim@firma.com';

  saveSuccess = false;

  ngOnInit() {
    this.loadSettings();  // Sayfa yüklendiğinde kaydedilmiş ayarları getirir.
  }

  loadSettings() {
    const saved = localStorage.getItem('crm_settings');
    if (saved) {
      try {
        const config = JSON.parse(saved);
        this.companyName = config.companyName || this.companyName;
        this.currency = config.currency || this.currency;
        this.emailNotifications = config.emailNotifications !== undefined ? config.emailNotifications : this.emailNotifications;
        this.smsNotifications = config.smsNotifications !== undefined ? config.smsNotifications : this.smsNotifications;
        this.systemAlerts = config.systemAlerts !== undefined ? config.systemAlerts : this.systemAlerts;
        this.autoBackup = config.autoBackup !== undefined ? config.autoBackup : this.autoBackup;
        this.monthlyReportEnabled = config.monthlyReportEnabled !== undefined ? config.monthlyReportEnabled : this.monthlyReportEnabled;
        this.monthlyReportDate = config.monthlyReportDate || this.monthlyReportDate;
        this.monthlyReportFormat = config.monthlyReportFormat || this.monthlyReportFormat;
        this.monthlyReportEmail = config.monthlyReportEmail || this.monthlyReportEmail;
      } catch (e) {
        console.error('Ayarlar yüklenirken hata oluştu:', e);
      }
    }
  }

  saveSettings() {
    const config = {
      companyName: this.companyName,
      currency: this.currency,
      emailNotifications: this.emailNotifications,
      smsNotifications: this.smsNotifications,
      systemAlerts: this.systemAlerts,
      autoBackup: this.autoBackup,
      monthlyReportEnabled: this.monthlyReportEnabled,
      monthlyReportDate: this.monthlyReportDate,
      monthlyReportFormat: this.monthlyReportFormat,
      monthlyReportEmail: this.monthlyReportEmail
    };

    localStorage.setItem('crm_settings', JSON.stringify(config));

    this.saveSuccess = true;
    setTimeout(() => {
      this.saveSuccess = false;
    }, 3000);
  }
}
