import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-simulation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="fw-bold display-6 text-center">Real-Time Prediction Simulation</h2>
    <p class="text-muted mb-4 text-center">Experience live quality predictions using your trained model.</p>
    
    <div class="d-flex justify-content-between align-items-center my-4">
      <button class="btn btn-outline-secondary btn-lg" (click)="goBackToTraining()">
        <svg class="me-2" style="height: 1rem; width: 1rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
        </svg>
        Back to Training
      </button>
      <button (click)="startSimulation()" 
              class="btn btn-success btn-lg" 
              [disabled]="simulationState() === 'running'"
              [class.loading]="simulationState() === 'running'">
        <span *ngIf="simulationState() === 'idle'">
          <svg class="me-2" style="height: 1.25rem; width: 1.25rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Start Simulation
        </span>
        <span *ngIf="simulationState() === 'running'" class="d-flex align-items-center justify-content-center">
          <div class="spinner-border spinner-border-sm me-2" role="status"></div>
          Running...
        </span>
        <span *ngIf="simulationState() === 'complete'">
          <svg class="me-2" style="height: 1.25rem; width: 1.25rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Restart Simulation
        </span>
      </button>
    </div>
      
    <ng-container *ngIf="simulationState() === 'complete'">
      <div class="alert alert-success mt-3 d-inline-flex align-items-center" role="alert">
        <svg class="flex-shrink-0 me-2" style="height: 1.25rem; width: 1.25rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <strong>Simulation completed successfully!</strong>
      </div>
    </ng-container>

    <div class="row g-4">
      <div class="col-lg-8">
        <div class="row g-4">
          <div class="col-md-8">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h4 class="h6 fw-bold mb-0">Real-Time Quality Predictions</h4>
                  <div class="d-flex align-items-center">
                    <div class="me-2" style="width: 8px; height: 8px; background: #0d6efd; border-radius: 50%;"></div>
                    <small class="text-muted">Live Data</small>
                  </div>
                </div>
                <div class="chart-container">
                  <svg viewBox="0 0 300 150" class="w-100">
                    <!-- Grid -->
                    <defs>
                      <pattern id="simulationGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" stroke-width="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#simulationGrid)" />
                    
                    <!-- Axes -->
                    <line x1="20" y1="130" x2="280" y2="130" stroke="#374151" stroke-width="2"/>
                    <line x1="20" y1="20" x2="20" y2="130" stroke="#374151" stroke-width="2"/>
                    
                    <!-- Quality line -->
                    <polyline [attr.points]="qualityScorePath()" 
                              fill="none" 
                              stroke="#0d6efd" 
                              stroke-width="3" 
                              stroke-linecap="round" 
                              stroke-linejoin="round"/>
                    
                    <!-- Confidence threshold line -->
                    <line x1="20" y1="85" x2="280" y2="85" stroke="#f59e0b" stroke-width="2" stroke-dasharray="5,5"/>
                    
                    <!-- Labels -->
                    <text x="10" y="25" font-size="10" fill="#6b7280">100%</text>
                    <text x="10" y="75" font-size="10" fill="#6b7280">50%</text>
                    <text x="10" y="125" font-size="10" fill="#6b7280">0%</text>
                    <text x="150" y="145" font-size="10" fill="#6b7280" text-anchor="middle">Time</text>
                  </svg>
                  <div class="d-flex justify-content-center gap-4 mt-2">
                    <div class="d-flex align-items-center">
                      <div class="me-2" style="width: 12px; height: 3px; background: #0d6efd;"></div>
                      <small class="text-muted">Confidence</small>
                    </div>
                    <div class="d-flex align-items-center">
                      <div class="me-2" style="width: 12px; height: 2px; background: #f59e0b; border-top: 1px dashed #f59e0b;"></div>
                      <small class="text-muted">Threshold</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body d-flex flex-column align-items-center justify-content-center">
                <h4 class="h6 fw-bold text-center mb-3">Pass Rate</h4>
                <div class="donut-wrapper position-relative">
                  <svg width="120" height="120" class="position-absolute">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" stroke-width="8"/>
                    <circle cx="60" cy="60" r="50" 
                            fill="none" 
                            stroke="#10b981" 
                            stroke-width="8" 
                            stroke-linecap="round"
                            [attr.stroke-dasharray]="circumference"
                            [attr.stroke-dashoffset]="getStrokeDashoffset()"
                            transform="rotate(-90 60 60)"/>
                  </svg>
                  <div class="progress-circle position-absolute top-50 start-50 translate-middle">
                    <span class="h3 fw-bold text-success">{{passPercentage()}}%</span>
                    <div class="small text-muted">Pass Rate</div>
                  </div>
                </div>
              </div>
            </div>
            </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <h4 class="h6 fw-bold text-center mb-3">Simulation Statistics</h4>
          <div class="row g-3 text-center">
              <div class="col-6">
                <div class="stat-card">
                  <div class="stat-icon bg-primary">
                    <svg style="height: 1.25rem; width: 1.25rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p class="small text-muted mb-1">Total Predictions</p>
                  <p class="h4 fw-bold mb-0">{{simulationStats().total}}</p>
                </div>
              </div>
              <div class="col-6">
                <div class="stat-card">
                  <div class="stat-icon bg-success">
                    <svg style="height: 1.25rem; width: 1.25rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p class="small text-muted mb-1">Pass Count</p>
                  <p class="h4 fw-bold text-success mb-0">{{simulationStats().pass}}</p>
                </div>
              </div>
              <div class="col-6">
                <div class="stat-card">
                  <div class="stat-icon bg-danger">
                    <svg style="height: 1.25rem; width: 1.25rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p class="small text-muted mb-1">Fail Count</p>
                  <p class="h4 fw-bold text-danger mb-0">{{simulationStats().fail}}</p>
                </div>
              </div>
              <div class="col-6">
                <div class="stat-card">
                  <div class="stat-icon bg-info">
                    <svg style="height: 1.25rem; width: 1.25rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p class="small text-muted mb-1">Avg. Confidence</p>
                  <p class="h4 fw-bold text-info mb-0">{{simulationStats().avgConfidence}}%</p>
                </div>
              </div>
            </div>
          </div>
          </div>
      </div>
    </div>

    <div class="mt-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="h5 fw-bold mb-0">Live Prediction Stream</h3>
        <div class="d-flex align-items-center">
          <div class="me-2" style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; animation: pulse 2s infinite;"></div>
          <small class="text-muted">Real-time Updates</small>
        </div>
      </div>
      <div class="table-responsive border rounded-3 shadow-sm" style="max-height: 20rem;">
        <table class="table table-sm table-hover mb-0">
          <thead class="table-light sticky-top">
            <tr>
              <th class="border-0">Time</th>
              <th class="border-0">Sample ID</th>
              <th class="border-0">Prediction</th>
              <th class="border-0">Confidence</th>
              <th class="border-0">Temperature</th>
              <th class="border-0">Pressure</th>
              <th class="border-0">Humidity</th>
            </tr>
          </thead>
          <tbody>
            <ng-container *ngIf="simulationData().length; else empty">
              <tr *ngFor="let row of simulationData(); trackBy: trackById" class="table-row">
                <td class="font-monospace small">{{ row.time }}</td>
                <td class="font-monospace small">{{ row.id }}</td>
                <td>
                  <span class="badge" [ngClass]="row.prediction === 'Pass' ? 'text-bg-success' : 'text-bg-danger'">
                    {{ row.prediction }}
                  </span>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="progress me-2" style="width: 40px; height: 4px;">
                      <div class="progress-bar" 
                           [ngClass]="row.confidence >= 80 ? 'bg-success' : row.confidence >= 60 ? 'bg-warning' : 'bg-danger'"
                           [style.width.%]="row.confidence">
                      </div>
                    </div>
                    <small class="fw-semibold">{{ row.confidence }}%</small>
                  </div>
                </td>
                <td class="small">{{ row.temp }}°C</td>
                <td class="small">{{ row.pressure }} hPa</td>
                <td class="small">{{ row.humidity }}%</td>
              </tr>
            </ng-container>
            <ng-template #empty>
              <tr>
                <td colspan="7" class="text-center p-5 text-muted">
                  <svg class="mb-2" style="height: 2rem; width: 2rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <div>Simulation has not started yet.</div>
                  <small>Click "Start Simulation" to begin real-time predictions.</small>
                </td>
              </tr>
            </ng-template>
          </tbody>
        </table>
      </div>
    </div>
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
    
    .donut-wrapper {
      width: 120px;
      height: 120px;
    }
    
    .progress-circle {
      width: 120px;
      height: 120px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    
    .stat-card {
      padding: 1rem;
      border-radius: 0.5rem;
      background: #f8f9fa;
      transition: transform 0.2s ease;
    }
    
    .stat-card:hover {
      transform: translateY(-2px);
    }
    
    .stat-icon {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      margin: 0 auto 0.5rem;
    }
    
    .table-row {
      transition: background-color 0.2s ease;
    }
    
    .table-row:hover {
      background-color: #f8f9fa;
    }
    
    .btn.loading {
      pointer-events: none;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    circle {
      transition: stroke-dashoffset 0.3s ease;
    }
  `]
})
export class SimulationComponent {
  simulationState = signal<'idle' | 'running' | 'complete'>('idle');
  simulationData = signal<any[]>([]);
  simulationStats = signal({ total: 0, pass: 0, fail: 0, avgConfidence: 0 });
  private simulationInterval: any;
  readonly circumference = 2 * Math.PI * 50; // radius = 50

  constructor(private router: Router) {}

  passPercentage = computed(() => {
    const stats = this.simulationStats();
    if (stats.total === 0) return 0;
    return Math.round((stats.pass / stats.total) * 100);
  });

  qualityScorePath = computed(() => {
    const data = this.simulationData();
    if (data.length < 2) return '20,130';
    const points = data.map((d, i) => {
      const x = 20 + (i / Math.max(data.length - 1, 1)) * 260;
      const y = 130 - (d.confidence / 100) * 110;
      return `${x},${y}`;
    });
    return points.join(' ');
  });

  getStrokeDashoffset(): number {
    const percentage = this.passPercentage();
    return this.circumference - (percentage / 100) * this.circumference;
  }

  startSimulation() {
    this.simulationData.set([]);
    this.simulationStats.set({ total: 0, pass: 0, fail: 0, avgConfidence: 0 });
    this.simulationState.set('running');
    if (this.simulationInterval) clearInterval(this.simulationInterval);

    let counter = 0;
    this.simulationInterval = setInterval(() => {
      counter++;
      const isPass = Math.random() > 0.15;
      const confidence = isPass ? Math.floor(80 + Math.random() * 20) : Math.floor(50 + Math.random() * 30);

      const newRow = {
        time: new Date().toLocaleTimeString(),
        id: `SAMPLE_${1000 + counter}`,
        prediction: isPass ? 'Pass' : 'Fail',
        confidence: confidence,
        temp: (20 + Math.random() * 5).toFixed(1),
        pressure: (1010 + Math.random() * 10).toFixed(2),
        humidity: (40 + Math.random() * 15).toFixed(1)
      };

      this.simulationData.update(currentData => [newRow, ...currentData].slice(0, 50));
      this.simulationStats.update(stats => {
        const newTotal = stats.total + 1;
        const newPass = stats.pass + (isPass ? 1 : 0);
        const newFail = stats.fail + (isPass ? 0 : 1);
        const newAvgConfidence = Math.round(((stats.avgConfidence * stats.total) + confidence) / newTotal);
        return { total: newTotal, pass: newPass, fail: newFail, avgConfidence: newAvgConfidence };
      });
      
      if (counter >= 20) {
        clearInterval(this.simulationInterval);
        this.simulationState.set('complete');
      }
    }, 1000);
  }

  trackById(index: number, item: any) {
    return item.id;
  }

  goBackToTraining() {
    this.router.navigate(['/training']);
  }
}
