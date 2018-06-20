import { HttpClientModule } from '@angular/common/http';
import { AppConfigService } from './app-config.service';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppConfig } from './app-config';

export function setupAppCofigServiceFactory(appConfig: AppConfigService): () => Promise<AppConfig> {
  return () => appConfig.Load();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    AppRoutingModule,
    NoopAnimationsModule,
    BrowserAnimationsModule
  ],
  exports: [
    NoopAnimationsModule,
    BrowserAnimationsModule
  ],
  providers: [
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: setupAppCofigServiceFactory,
      deps: [AppConfigService], multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
