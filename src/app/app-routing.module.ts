import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  { path: '', redirectTo: 'monitor', pathMatch: 'full' },
  { path: 'monitor', loadChildren: './monitor/monitor.module#MonitorModule' },
  { path: 'editor', loadChildren: './modules/map-editor/map-editor.module#MapEditorModule' },
  { path: 'history', loadChildren: './modules/history/history.module#HistoryModule' },
  { path: 'cmonitor', loadChildren: './modules/c-monitor/c-monitor.module#CMonitorModule' },
  { path: 'route', loadChildren: './modules/route/route.module#RouteModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
