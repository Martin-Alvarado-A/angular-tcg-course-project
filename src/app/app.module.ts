import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthEffects } from './auth/store/auth.effect';
import { CoreModule } from './core.module';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from './shared/shared.module';
import * as fromApp from './store/app.reducer';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot(fromApp.appReducer, {}),
    EffectsModule.forRoot([AuthEffects]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    SharedModule,
    CoreModule,
  ],
  bootstrap: [AppComponent],
  // providers: [LoggingService],
})
export class AppModule {}
