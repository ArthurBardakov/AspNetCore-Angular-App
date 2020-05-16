import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { OAuthModule } from 'angular-oauth2-oidc';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { APP_ROUTES } from './app.routes';
import { UserDataService } from 'src/services/user-data.service';
import { HubService } from 'src/services/hub.service';
import { TokenInterceptor } from 'src/services/interceptor.service';
import { APP_CONFIG, AppConfig } from './app.config';
import { InfoService } from 'src/services/info.service';
import { EventsService } from 'src/services/events.service';
import { AccountService } from 'src/services/account.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    NgxSpinnerModule,
    MatSnackBarModule,
    RouterModule.forRoot(APP_ROUTES),
    OAuthModule.forRoot()
  ],
  providers: [
    AccountService,
    EventsService,
    UserDataService,
    InfoService,
    HubService,
    {
       provide: APP_CONFIG,
       useValue: AppConfig
    },
    {
       provide: HTTP_INTERCEPTORS,
       useClass: TokenInterceptor,
       multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
