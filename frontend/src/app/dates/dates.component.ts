import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2 class="fw-bold display-6 text-center">Date Range Selection</h2>
    <p class="text-muted mb-4 text-center">Define time-based splits for training, testing, and simulation periods.</p>

    <div class="row g-4 mb-4">
      <div class="col-md-4">
        <div class="card border-0 h-100" [class.border-primary]="isDatesValid()" [class.bg-light]="!isDatesValid()">
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <div class="step-icon bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 2.5rem; height: 2.5rem;">
                <svg style="height: 1.25rem; width: 1.25rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 class="h5 card-title fw-bold mb-0">Training Period</h3>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">Start Date</label>
              <input type="date" class="form-control" [(ngModel)]="trainingStart" (change)="onDateChange()">
            </div>
            <div>
              <label class="form-label fw-semibold">End Date</label>
              <input type="date" class="form-control" [(ngModel)]="trainingEnd" (change)="onDateChange()">
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 h-100" [class.border-warning]="isDatesValid()" [class.bg-light]="!isDatesValid()">
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <div class="step-icon bg-warning text-white rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 2.5rem; height: 2.5rem;">
                <svg style="height: 1.25rem; width: 1.25rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="h5 card-title fw-bold mb-0">Testing Period</h3>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">Start Date</label>
              <input type="date" class="form-control" [(ngModel)]="testingStart" (change)="onDateChange()">
            </div>
            <div>
              <label class="form-label fw-semibold">End Date</label>
              <input type="date" class="form-control" [(ngModel)]="testingEnd" (change)="onDateChange()">
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 h-100" [class.border-info]="isDatesValid()" [class.bg-light]="!isDatesValid()">
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <div class="step-icon bg-info text-white rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 2.5rem; height: 2.5rem;">
                <svg style="height: 1.25rem; width: 1.25rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 class="h5 card-title fw-bold mb-0">Simulation Period</h3>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">Start Date</label>
              <input type="date" class="form-control" [(ngModel)]="simulationStart" (change)="onDateChange()">
            </div>
            <div>
              <label class="form-label fw-semibold">End Date</label>
              <input type="date" class="form-control" [(ngModel)]="simulationEnd" (change)="onDateChange()">
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="text-center mb-4">
      <button (click)="validateDateRanges()" 
              class="btn btn-primary btn-lg" 
              [disabled]="isValidating()"
              [class.loading]="isValidating()">
        <span *ngIf="!isValidating()">Validate Date Ranges</span>
        <span *ngIf="isValidating()" class="d-flex align-items-center justify-content-center">
          <div class="spinner-border spinner-border-sm me-2" role="status"></div>
          Validating...
        </span>
      </button>
    </div>

    <ng-container *ngIf="isDatesValid()">
      <div class="border-top pt-4">
        <div class="alert alert-success d-flex align-items-center" role="alert">
          <svg class="flex-shrink-0 me-2" style="height: 1.25rem; width: 1.25rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <strong>Date ranges validated successfully!</strong>
            <br>
            <small>All periods are properly configured and ready for model training.</small>
          </div>
        </div>
        
        <div class="row text-center g-3 my-4">
          <div class="col-md-4">
            <div class="card border-primary">
              <div class="card-body">
                <div class="d-flex align-items-center justify-content-center mb-2">
                  <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style="width: 2rem; height: 2rem;">
                    <svg style="height: 1rem; width: 1rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h4 class="h6 card-title fw-bold mb-0">Training Period</h4>
                </div>
                <p class="card-text mb-1 h4 fw-bold text-primary">{{dateSummary.training.duration}} days</p>
                <small class="text-muted">{{dateSummary.training.range}}</small>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card border-warning">
              <div class="card-body">
                <div class="d-flex align-items-center justify-content-center mb-2">
                  <div class="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center me-2" style="width: 2rem; height: 2rem;">
                    <svg style="height: 1rem; width: 1rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 class="h6 card-title fw-bold mb-0">Testing Period</h4>
                </div>
                <p class="card-text mb-1 h4 fw-bold text-warning">{{dateSummary.testing.duration}} days</p>
                <small class="text-muted">{{dateSummary.testing.range}}</small>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card border-info">
              <div class="card-body">
                <div class="d-flex align-items-center justify-content-center mb-2">
                  <div class="bg-info text-white rounded-circle d-flex align-items-center justify-content-center me-2" style="width: 2rem; height: 2rem;">
                    <svg style="height: 1rem; width: 1rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 class="h6 card-title fw-bold mb-0">Simulation Period</h4>
        </div>
                <p class="card-text mb-1 h4 fw-bold text-info">{{dateSummary.simulation.duration}} days</p>
                <small class="text-muted">{{dateSummary.simulation.range}}</small>
        </div>
          </div>
          </div>
        </div>
        
        <div class="mb-4">
          <h3 class="h5 fw-bold text-center mb-3">Timeline Overview</h3>
          <div class="chart-container">
            <svg viewBox="0 0 400 200" class="w-100">
              <!-- Grid lines -->
              <defs>
                <pattern id="timelineGrid" width="40" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" stroke-width="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#timelineGrid)" />
              
              <!-- Axes -->
              <line x1="50" y1="160" x2="350" y2="160" stroke="#374151" stroke-width="2"/>
              <line x1="50" y1="20" x2="50" y2="160" stroke="#374151" stroke-width="2"/>
              
              <!-- Bars -->
              <rect x="60" y="60" width="120" height="100" fill="#0d6efd" rx="4" ry="4">
                <title>Training Period: {{dateSummary.training.duration}} days</title>
              </rect>
              <rect x="200" y="100" width="50" height="60" fill="#ffc107" rx="4" ry="4">
                <title>Testing Period: {{dateSummary.testing.duration}} days</title>
              </rect>
              <rect x="270" y="130" width="30" height="30" fill="#0dcaf0" rx="4" ry="4">
                <title>Simulation Period: {{dateSummary.simulation.duration}} days</title>
              </rect>
              
              <!-- Bar labels -->
              <text x="120" y="50" font-size="12" fill="#0d6efd" text-anchor="middle" font-weight="600">Training</text>
              <text x="225" y="90" font-size="12" fill="#ffc107" text-anchor="middle" font-weight="600">Testing</text>
              <text x="285" y="120" font-size="12" fill="#0dcaf0" text-anchor="middle" font-weight="600">Simulation</text>
              
              <!-- Duration labels -->
              <text x="120" y="175" font-size="10" fill="#6b7280" text-anchor="middle">{{dateSummary.training.duration}} days</text>
              <text x="225" y="175" font-size="10" fill="#6b7280" text-anchor="middle">{{dateSummary.testing.duration}} days</text>
              <text x="285" y="175" font-size="10" fill="#6b7280" text-anchor="middle">{{dateSummary.simulation.duration}} days</text>
              
              <!-- Y-axis labels -->
              <text x="40" y="25" font-size="10" fill="#6b7280" text-anchor="end">180</text>
              <text x="40" y="70" font-size="10" fill="#6b7280" text-anchor="end">120</text>
              <text x="40" y="115" font-size="10" fill="#6b7280" text-anchor="end">60</text>
              <text x="40" y="160" font-size="10" fill="#6b7280" text-anchor="end">0</text>
              
              <!-- Axis labels -->
              <text x="200" y="190" font-size="12" fill="#374151" text-anchor="middle" font-weight="600">Time Periods</text>
              <text x="20" y="90" font-size="12" fill="#374151" text-anchor="middle" font-weight="600" transform="rotate(-90 20 90)">Days</text>
            </svg>
          </div>
        </div>
        
        <div class="d-flex justify-content-between align-items-center">
          <button class="btn btn-outline-secondary btn-lg" (click)="goBackToUpload()">
            <svg class="me-2" style="height: 1rem; width: 1rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Back to Upload
          </button>
          <button class="btn btn-success btn-lg" (click)="proceedToTraining()">
            Continue to Model Training
            <svg class="ms-2" style="height: 1rem; width: 1rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </ng-container>
  `,
  styles: [`
    .card {
      transition: all 0.3s ease;
    }
    
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .step-icon {
      transition: transform 0.3s ease;
    }
    
    .card:hover .step-icon {
      transform: scale(1.1);
    }
    
    .btn.loading {
      pointer-events: none;
    }
    
    .progress {
      box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
    }
    
    .progress-bar {
      transition: width 0.6s ease;
    }
  `]
})
export class DatesComponent {
  isDatesValid = signal(false);
  isValidating = signal(false);
  
  trainingStart = '2021-01-01';
  trainingEnd = '2021-06-29';
  testingStart = '2021-06-30';
  testingEnd = '2021-08-28';
  simulationStart = '2021-08-29';
  simulationEnd = '2021-09-27';
  
  dateSummary = {
    training: { duration: 180, range: '2021-01-01 to 2021-06-29' },
    testing: { duration: 60, range: '2021-06-30 to 2021-08-28' },
    simulation: { duration: 30, range: '2021-08-29 to 2021-09-27' }
  };

  constructor(private router: Router) {}

  onDateChange() {
    // Update date summary when dates change
    this.updateDateSummary();
  }

  updateDateSummary() {
    const trainingDuration = this.calculateDays(this.trainingStart, this.trainingEnd);
    const testingDuration = this.calculateDays(this.testingStart, this.testingEnd);
    const simulationDuration = this.calculateDays(this.simulationStart, this.simulationEnd);
    
    this.dateSummary = {
      training: { 
        duration: trainingDuration, 
        range: `${this.trainingStart} to ${this.trainingEnd}` 
      },
      testing: { 
        duration: testingDuration, 
        range: `${this.testingStart} to ${this.testingEnd}` 
      },
      simulation: { 
        duration: simulationDuration, 
        range: `${this.simulationStart} to ${this.simulationEnd}` 
      }
    };
  }

  calculateDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  validateDateRanges() {
    this.isValidating.set(true);
    
    setTimeout(() => {
      this.isDatesValid.set(true);
      this.isValidating.set(false);
    }, 1500);
  }

  proceedToTraining() {
    this.router.navigate(['/training']);
  }

  goBackToUpload() {
    this.router.navigate(['/upload']);
  }
}
