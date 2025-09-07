import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-training',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="fw-bold display-6 text-center">Model Training & Evaluation</h2>
    <p class="text-muted mb-4 text-center">Train your predictive model using the configured data and date ranges.</p>

    <ng-container *ngIf="trainingState() === 'idle'">
      <div class="d-flex flex-column align-items-center justify-content-center text-center" style="min-height: 400px;">
        <div class="card border-0 bg-light w-100 mb-4" style="max-width: 500px;">
          <div class="card-body">
            <svg class="text-primary mb-3" style="height: 3rem; width: 3rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h4 class="fw-bold">Ready to Train</h4>
            <p class="text-muted mb-3">Your model will be trained using the uploaded dataset and configured date ranges.</p>
            <div class="row g-2 text-start">
              <div class="col-6"><small class="text-muted">Training Data:</small><br><strong>180 days</strong></div>
              <div class="col-6"><small class="text-muted">Testing Data:</small><br><strong>60 days</strong></div>
            </div>
          </div>
        </div>
        <button (click)="trainModel()" class="btn btn-primary btn-lg">
          <svg class="me-2" style="height: 1.25rem; width: 1.25rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Start Training
        </button>
      </div>
    </ng-container>
    
    <ng-container *ngIf="trainingState() === 'training'">
      <div class="d-flex flex-column align-items-center justify-content-center text-center" style="min-height: 400px;">
        <div class="card border-0 bg-light w-100 mb-4" style="max-width: 500px;">
          <div class="card-body">
            <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;">
              <span class="visually-hidden">Training...</span>
            </div>
            <h4 class="fw-bold">Training in Progress</h4>
            <p class="text-muted mb-3">Please wait while the model is being trained. This may take a few minutes.</p>
            
            <div class="progress mb-3" style="height: 0.5rem;">
              <div class="progress-bar progress-bar-striped progress-bar-animated" 
                   role="progressbar" 
                   [style.width.%]="trainingProgress()"
                   aria-valuenow="trainingProgress()" 
                   aria-valuemin="0" 
                   aria-valuemax="100">
              </div>
            </div>
            <small class="text-muted">{{trainingProgress()}}% Complete</small>
          </div>
        </div>
      </div>
    </ng-container>
    
    <ng-container *ngIf="trainingState() === 'complete' && modelMetrics()">
      <div class="mt-4">
        <div class="alert alert-success d-flex align-items-center" role="alert">
          <svg class="flex-shrink-0 me-2" style="height: 1.25rem; width: 1.25rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <strong>Model Training Completed Successfully!</strong>
            <br>
            <small>Your predictive model is ready for simulation and deployment.</small>
          </div>
        </div>
        
        <h3 class="h5 fw-bold text-center mt-4 mb-4">Model Performance Metrics</h3>
        <div class="row g-3 my-3">
          <div class="col-sm-6 col-lg-3">
            <div class="card text-center border-0 h-100" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <div class="card-body text-white">
                <svg class="mb-2" style="height: 2rem; width: 2rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="mb-1 fw-semibold">Accuracy</p>
                <p class="h3 fw-bold mb-0">{{modelMetrics()?.accuracy}}%</p>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-lg-3">
            <div class="card text-center border-0 h-100" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
              <div class="card-body text-white">
                <svg class="mb-2" style="height: 2rem; width: 2rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p class="mb-1 fw-semibold">Precision</p>
                <p class="h3 fw-bold mb-0">{{modelMetrics()?.precision}}%</p>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-lg-3">
            <div class="card text-center border-0 h-100" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
              <div class="card-body text-white">
                <svg class="mb-2" style="height: 2rem; width: 2rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <p class="mb-1 fw-semibold">Recall</p>
                <p class="h3 fw-bold mb-0">{{modelMetrics()?.recall}}%</p>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-lg-3">
            <div class="card text-center border-0 h-100" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
              <div class="card-body text-white">
                <svg class="mb-2" style="height: 2rem; width: 2rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <p class="mb-1 fw-semibold">F1-Score</p>
                <p class="h3 fw-bold mb-0">{{modelMetrics()?.f1Score}}%</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="row g-4 mt-4">
          <div class="col-md-6">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body">
                <h4 class="h6 fw-bold text-center mb-3">Training Progress</h4>
                <div class="chart-container">
                  <svg viewBox="0 0 300 150" class="w-100">
                    <!-- Grid lines -->
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" stroke-width="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    
                    <!-- Axes -->
                    <line x1="20" y1="130" x2="280" y2="130" stroke="#374151" stroke-width="2"/>
                    <line x1="20" y1="20" x2="20" y2="130" stroke="#374151" stroke-width="2"/>
                    
                    <!-- Accuracy line -->
                    <polyline points="20,80 80,60 140,50 200,40 260,30" 
                              fill="none" 
                              stroke="#10b981" 
                              stroke-width="3" 
                              stroke-linecap="round" 
                              stroke-linejoin="round"/>
                    
                    <!-- Loss line -->
                    <polyline points="20,120 80,100 140,85 200,75 260,70" 
                              fill="none" 
                              stroke="#f59e0b" 
                              stroke-width="3" 
                              stroke-linecap="round" 
                              stroke-linejoin="round"/>
                    
                    <!-- Labels -->
                    <text x="10" y="25" font-size="10" fill="#6b7280">100%</text>
                    <text x="10" y="75" font-size="10" fill="#6b7280">50%</text>
                    <text x="10" y="125" font-size="10" fill="#6b7280">0%</text>
                    <text x="150" y="145" font-size="10" fill="#6b7280" text-anchor="middle">Epochs</text>
                  </svg>
                  <div class="d-flex justify-content-center gap-4 mt-2">
                    <div class="d-flex align-items-center">
                      <div class="me-2" style="width: 12px; height: 3px; background: #10b981;"></div>
                      <small class="text-muted">Accuracy</small>
                    </div>
                    <div class="d-flex align-items-center">
                      <div class="me-2" style="width: 12px; height: 3px; background: #f59e0b;"></div>
                      <small class="text-muted">Loss</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body">
                <h4 class="h6 fw-bold text-center mb-3">Confusion Matrix</h4>
                <div class="d-flex justify-content-center align-items-center h-100">
                  <div class="confusion-donut-wrapper position-relative">
                    <svg width="200" height="200">
                      <!-- True Positive (green) -->
                      <circle
                        cx="100" cy="100" r="80"
                        fill="none"
                        stroke="#10b981"
                        stroke-width="20"
                        stroke-dasharray="120.6 382.05"
                        transform="rotate(-90 100 100)"
                        stroke-linecap="butt"
                      />
                      <!-- False Negative (yellow) -->
                      <circle
                        cx="100" cy="100" r="80"
                        fill="none"
                        stroke="#f59e0b"
                        stroke-width="20"
                        stroke-dasharray="31.6 471.05"
                        transform="rotate(0 100 100)"
                        stroke-linecap="butt"
                      />
                      <!-- False Positive (red) -->
                      <circle
                        cx="100" cy="100" r="80"
                        fill="none"
                        stroke="#ef4444"
                        stroke-width="20"
                        stroke-dasharray="37.7 465.0"
                        transform="rotate(32 100 100)"
                        stroke-linecap="butt"
                      />
                      <!-- True Negative (blue) -->
                      <circle
                        cx="100" cy="100" r="80"
                        fill="none"
                        stroke="#3b82f6"
                        stroke-width="20"
                        stroke-dasharray="312.75 189.9"
                        transform="rotate(75 100 100)"
                        stroke-linecap="butt"
                      />
                    </svg>
                    <div class="confusion-donut-center position-absolute top-50 start-50 translate-middle text-center">
                      <div class="h5 fw-bold text-primary mb-1">94.2%</div>
                      <div class="small text-muted">Accuracy</div>
                    </div>
                  </div>
                </div>
                <div class="row g-1 mt-2">
                  <div class="col-12">
                    <div class="d-flex align-items-center justify-content-center mb-1">
                      <div class="me-2" style="width: 12px; height: 12px; background: #10b981; border-radius: 2px;"></div>
                      <small class="text-muted">True Positive: 85.2%</small>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="d-flex align-items-center justify-content-center mb-1">
                      <div class="me-2" style="width: 12px; height: 12px; background: #f59e0b; border-radius: 2px;"></div>
                      <small class="text-muted">False Negative: 6.3%</small>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="d-flex align-items-center justify-content-center mb-1">
                      <div class="me-2" style="width: 12px; height: 12px; background: #ef4444; border-radius: 2px;"></div>
                      <small class="text-muted">False Positive: 7.5%</small>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="d-flex align-items-center justify-content-center mb-1">
                      <div class="me-2" style="width: 12px; height: 12px; background: #3b82f6; border-radius: 2px;"></div>
                      <small class="text-muted">True Negative: 91.0%</small>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
        
        <div class="d-flex justify-content-between align-items-center mt-5">
          <button class="btn btn-outline-secondary btn-lg" (click)="goBackToDates()">
            <svg class="me-2" style="height: 1rem; width: 1rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Back to Date Selection
          </button>
          <button (click)="proceedToSimulation()" class="btn btn-success" style="position: relative; z-index: 10;">Start Simulation</button>
        </div>
      </div>
    </ng-container>
  `,
  styles: [`
    .card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
    }
    
    .chart-container {
      background: #f8f9fa;
      border-radius: 0.5rem;
      padding: 1rem;
    }
    
    .confusion-donut-wrapper {
      width: 200px;
      height: 200px;
    }
    
    .confusion-donut-center {
      width: 200px;
      height: 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    circle {
      transition: stroke-dasharray 0.6s ease;
    }
    
    .progress-bar-animated {
      animation: progress-bar-stripes 1s linear infinite;
    }
  `]
})
export class TrainingComponent {
  trainingState = signal<'idle' | 'training' | 'complete'>('idle');
  modelMetrics = signal<{accuracy: number, precision: number, recall: number, f1Score: number} | null>(null);
  trainingProgress = signal(0);
  private progressInterval: any;

  constructor(private router: Router) {}

  trainModel() {
    console.log('trainModel called');
    this.trainingState.set('training');
    this.trainingProgress.set(0);

    this.progressInterval = setInterval(() => {
      let currentProgress = this.trainingProgress();
      if (currentProgress < 100) {
        // Clamp to 100 to avoid floating point issues
        const next = Math.min(currentProgress + Math.random() * 15, 100);
        this.trainingProgress.set(next);
      } else {
        this.trainingProgress.set(100);
        clearInterval(this.progressInterval);

        setTimeout(() => {
          this.modelMetrics.set({
            accuracy: 94.2,
            precision: 92.8,
            recall: 91.5,
            f1Score: 92.1
          });
          this.trainingState.set('complete');
          console.log('Training complete, metrics set');
        }, 500);
      }
    }, 200);
  }

  proceedToSimulation() {
    console.log('Navigating to simulation...');
    this.router.navigate(['/simulation']);
  }

  goBackToDates() {
    this.router.navigate(['/dates']);
  }
}
