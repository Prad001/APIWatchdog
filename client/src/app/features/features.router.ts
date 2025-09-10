import { Routes, RouterModule } from "@angular/router";

import { FeaturesComponent } from "./features.component";
import { FullReportComponent } from "./full-report/full-report.component";
import { EndpointDetailsComponent } from "./endpoint-details/endpoint-details.component";
import { FlowComponent } from "./flow/flow.component";
import { SpecsViewComponent } from "./specs-view/specs-view.component";
import { SecurityInsightsComponent } from "./security-insights/security-insights.component";


export const featuresRoutes: Routes = [
  {
    path: "features",
    component: FeaturesComponent,
    canActivate: [],
    children: [
      

     { path: "", component: FullReportComponent },
     { path: "endpoint-details", component: EndpointDetailsComponent },
     { path: "flow", component: FlowComponent },
     { path: "security-insights", component: SecurityInsightsComponent },
     { path: "specs-view", component: SpecsViewComponent },

      
      
    ],
  },
  { path: "features", component: FeaturesComponent },

];

export const featuresRouter = RouterModule.forChild(featuresRoutes);
