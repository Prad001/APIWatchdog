import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FeaturesComponent } from './features/features.component';
import { FullReportComponent } from './features/full-report/full-report.component';
import { EndpointDetailsComponent } from './features/endpoint-details/endpoint-details.component';
import { FlowComponent } from './features/flow/flow.component';
import { SecurityInsightsComponent } from './features/security-insights/security-insights.component';
import { SpecsViewComponent } from './features/specs-view/specs-view.component';
import { ReportGuard } from './core/guard/report.guard';
// import { DocsComponent } from './docs/docs.component';

export const routes: Routes = [
     {path: '',component:HomeComponent},
    //  { path: 'docs', component:  DocsComponent  },
     {
    path: 'features',
    component: FeaturesComponent,
    canActivate: [ReportGuard],
    children: [
     //  { path: 'dashboard', component: DashboardComponent },
      //{ path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        { path: 'full-report', component: FullReportComponent },
      { path: 'endpoint-details', component: EndpointDetailsComponent },
      { path: 'specs-view', component:  SpecsViewComponent   },
      { path: 'flow', component: FlowComponent   },
      { path: 'security-insights', component:  SecurityInsightsComponent  },
       
    ]
  }
];
