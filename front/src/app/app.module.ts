import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { HttpClientModule } from "@angular/common/http";
import { UserService } from "./services/user/user.service";
import { SecurityService } from "./services/security/security.service";
import { ArticleService } from "./services/article/article.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ProfileComponent } from './components/profile/profile.component';
import { AddArticleComponent } from './components/add-article/add-article.component';
import { EvaluateComponent } from './components/evaluate/evaluate.component';

@NgModule({
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule
    ],
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    ArticlesComponent,
    ProfileComponent,
    AddArticleComponent,
    EvaluateComponent,
  ],
  providers: [
    UserService,
    SecurityService,
    ArticleService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
