import { Routes } from '@angular/router';
import { TreeChartComponent } from './assignments-menu/assignments/d3-charts/tree-chart/tree-chart.component';
import { AssignmentsMenuComponent } from './assignments-menu/assignments-menu.component';
import { VulnCardsComponent } from './assignments-menu/assignments/vuln-cards/vuln-cards.component';

export const routes: Routes = [
  { path: 'main-page', component: AssignmentsMenuComponent },
  { path: 'tree-chart/', component: TreeChartComponent },
  { path: 'vuln-cards/', component: VulnCardsComponent },

  { path: '', component: AssignmentsMenuComponent },
  { path: '**', component: AssignmentsMenuComponent },
];
