
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="d-flex flex-column align-items-center justify-content-center h-100 text-center">
      <ng-container *ngIf="!fileMetadata(); else uploaded">
        <h2 class="fw-bold display-6">Upload Dataset</h2>
        <p class="text-muted mb-4">Begin by uploading your quality control data in CSV format.</p>
        
        <div class="upload-area w-100" 
             [class.drag-over]="isDragOver()"
             (click)="triggerFileInput()"
             (dragover)="onDragOver($event)"
             (dragleave)="onDragLeave($event)"
             (drop)="onDrop($event)">
          
          <div *ngIf="!isUploading()" class="upload-content">
            <svg class="text-secondary mb-3 upload-icon" style="height: 4rem; width: 4rem;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p class="fw-semibold mb-2">Click to select a CSV file or drag and drop</p>
            <p class="small text-muted mb-3">Maximum file size: 50MB • Supported formats: CSV</p>
            <button class="btn btn-primary">Choose File</button>
          </div>
          
          <div *ngIf="isUploading()" class="upload-content">
            <div class="spinner-border text-primary mb-3" role="status">
              <span class="visually-hidden">Uploading...</span>
            </div>
            <p class="fw-semibold">Uploading and processing file...</p>
            <p class="small text-muted">This may take a few moments</p>
          </div>
        </div>
        
        <input #fileInput type="file" class="d-none" accept=".csv" (change)="onFileSelected($event)">
        
        <div class="mt-4">
          <div class="row g-3">
            <div class="col-md-4">
              <div class="card border-0 bg-light">
                <div class="card-body text-center">
                  <svg class="text-primary mb-2" style="height: 2rem; width: 2rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h6 class="fw-bold">CSV Format</h6>
                  <p class="small text-muted mb-0">Comma-separated values with headers</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card border-0 bg-light">
                <div class="card-body text-center">
                  <svg class="text-primary mb-2" style="height: 2rem; width: 2rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h6 class="fw-bold">Fast Processing</h6>
                  <p class="small text-muted mb-0">Automatic data validation and analysis</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card border-0 bg-light">
                <div class="card-body text-center">
                  <svg class="text-primary mb-2" style="height: 2rem; width: 2rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h6 class="fw-bold">Secure Upload</h6>
                  <p class="small text-muted mb-0">Your data is processed locally</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ng-container>
      
      <ng-template #uploaded>
        <h2 class="fw-bold display-6 text-success">Upload Successful</h2>
        <p class="text-muted mb-4">File metadata has been extracted and validated.</p>
        
        <div class="card w-100 shadow-sm">
          <div class="card-header bg-success text-white fw-bold d-flex justify-content-between align-items-center">
            <span>File Summary</span>
            <svg class="text-white" style="height: 1.25rem; width: 1.25rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <span>File Name</span>
              <span class="fw-semibold text-primary">{{ fileMetadata()?.fileName }}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <span>Total Records</span>
              <span class="font-monospace fw-semibold">{{ fileMetadata()?.totalRecords }}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <span>Total Columns</span>
              <span class="font-monospace fw-semibold">{{ fileMetadata()?.totalColumns }}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <span>Pass Rate</span>
              <span class="font-monospace fw-semibold text-success">{{ fileMetadata()?.passRate }}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <span>Date Range</span>
              <span class="font-monospace fw-semibold">{{ fileMetadata()?.dateRange }}</span>
            </li>
          </ul>
        </div>
        
        <div class="mt-4">
          <button class="btn btn-success btn-lg" (click)="proceedToDates()">
            Continue to Date Selection
            <svg class="ms-2" style="height: 1rem; width: 1rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .upload-area {
      border: 2px dashed #dee2e6;
      border-radius: 0.75rem;
      padding: 3rem;
      cursor: pointer;
      transition: all 0.3s ease;
      background: #f8f9fa;
      margin-bottom: 2rem;
      position: relative;
      overflow: hidden;
    }
    
    .upload-area:hover {
      border-color: #0d6efd;
      background: #f0f8ff;
    }
    
    .upload-area.drag-over {
      border-color: #0d6efd;
      background: #e3f2fd;
      transform: scale(1.02);
    }
    
    .upload-content {
      transition: opacity 0.3s ease;
    }
    
    .upload-icon {
      transition: transform 0.3s ease;
    }
    
    .upload-area:hover .upload-icon {
      transform: translateY(-2px);
    }
    
    .card {
      transition: transform 0.2s ease;
    }
    
    .card:hover {
      transform: translateY(-2px);
    }
  `]
})
export class UploadComponent {
  fileMetadata = signal<{fileName: string, totalRecords: string, totalColumns: string, passRate: string, dateRange: string} | null>(null);
  isDragOver = signal(false);
  isUploading = signal(false);

  constructor(private router: Router) {}

  triggerFileInput() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleFileUpload(input.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(false);
    
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        this.handleFileUpload(file);
      } else {
        alert('Please upload a CSV file only.');
      }
    }
  }

  handleFileUpload(file: File) {
    this.isUploading.set(true);
    
    // Mock API call for file upload and processing
    setTimeout(() => {
      this.fileMetadata.set({
        fileName: file.name,
        totalRecords: '1,184,704',
        totalColumns: '970',
        passRate: '0.58%',
        dateRange: '2021-01-01 to 2021-12-31'
      });
      this.isUploading.set(false);
    }, 2000);
  }

  proceedToDates() {
    this.router.navigate(['/dates']);
  }
}
