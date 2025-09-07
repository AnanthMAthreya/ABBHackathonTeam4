import { Component } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <div class="bg-light min-vh-100">
      <header class="bg-white shadow-sm sticky-top">
        <div class="container-xl d-flex justify-content-between align-items-center py-3">
          <div class="d-flex align-items-center gap-3">
             <svg style="height: 2rem; width: auto;" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 4C12.96 4 4 12.96 4 24s8.96 20 20 20 20-8.96 20-20S35.04 4 24 4zm-4 29V15l12 9-12 9z" fill="#3B82F6"></path></svg>
             <h1 class="h4 mb-0 fw-bold">MiniML - Predictive Quality Control</h1>
          </div>
          <div class="abb-logo">
            <img src="./assets/logo.png" alt="ABB Logo" style="height: 2.5rem; width: auto;" onerror="this.style.display='none'; console.log('Logo not found at:', this.src);">
          </div>
        </div>
        
        <!-- Progress Navigation -->
        <div class="container-xl">
          <nav class="progress-nav">
            <div class="progress-steps">
              <div class="step" [class.active]="currentStep >= 1" [class.completed]="currentStep > 1">
                <div class="step-circle">
                  <span *ngIf="currentStep > 1">✓</span>
                  <span *ngIf="currentStep <= 1">1</span>
                </div>
                <span class="step-label">Upload Data</span>
              </div>
              <div class="step-connector" [class.completed]="currentStep > 1"></div>
              <div class="step" [class.active]="currentStep >= 2" [class.completed]="currentStep > 2">
                <div class="step-circle">
                  <span *ngIf="currentStep > 2">✓</span>
                  <span *ngIf="currentStep <= 2">2</span>
                </div>
                <span class="step-label">Date Ranges</span>
              </div>
              <div class="step-connector" [class.completed]="currentStep > 2"></div>
              <div class="step" [class.active]="currentStep >= 3" [class.completed]="currentStep > 3">
                <div class="step-circle">
                  <span *ngIf="currentStep > 3">✓</span>
                  <span *ngIf="currentStep <= 3">3</span>
                </div>
                <span class="step-label">Training</span>
              </div>
              <div class="step-connector" [class.completed]="currentStep > 3"></div>
              <div class="step" [class.active]="currentStep >= 4" [class.completed]="currentStep > 4">
                <div class="step-circle">
                  <span *ngIf="currentStep > 4">✓</span>
                  <span *ngIf="currentStep <= 4">4</span>
                </div>
                <span class="step-label">Simulation</span>
              </div>
            </div>
          </nav>
        </div>
      </header>
      <main class="container-xl py-5">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .abb-logo { 
      display: flex;
      align-items: center;
    }
    
    .progress-nav {
      padding: 1rem 0;
      border-top: 1px solid #e9ecef;
    }
    
    .progress-steps {
      display: flex;
      align-items: center;
      justify-content: center;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }
    
    .step-circle {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: #e9ecef;
      color: #6c757d;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
      transition: all 0.3s ease;
      border: 2px solid #e9ecef;
    }
    
    .step.active .step-circle {
      background: #0d6efd;
      color: white;
      border-color: #0d6efd;
    }
    
    .step.completed .step-circle {
      background: #198754;
      color: white;
      border-color: #198754;
    }
    
    .step-label {
      font-size: 0.75rem;
      font-weight: 500;
      color: #6c757d;
      margin-top: 0.5rem;
      text-align: center;
    }
    
    .step.active .step-label {
      color: #0d6efd;
      font-weight: 600;
    }
    
    .step.completed .step-label {
      color: #198754;
      font-weight: 600;
    }
    
    .step-connector {
      width: 4rem;
      height: 2px;
      background: #e9ecef;
      margin: 0 1rem;
      transition: all 0.3s ease;
    }
    
    .step-connector.completed {
      background: #198754;
    }
    
    @media (max-width: 768px) {
      .progress-steps {
        max-width: 100%;
      }
      
      .step-circle {
        width: 2rem;
        height: 2rem;
        font-size: 0.75rem;
      }
      
      .step-connector {
        width: 2rem;
        margin: 0 0.5rem;
      }
      
      .step-label {
        font-size: 0.625rem;
      }
    }
  `],
})
export class App {
  currentStep = 1;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateCurrentStep(event.url);
      });
  }

  private updateCurrentStep(url: string) {
    if (url.includes('/upload')) {
      this.currentStep = 1;
    } else if (url.includes('/dates')) {
      this.currentStep = 2;
    } else if (url.includes('/training')) {
      this.currentStep = 3;
    } else if (url.includes('/simulation')) {
      this.currentStep = 4;
    }
  }
}
