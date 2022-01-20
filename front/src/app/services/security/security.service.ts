import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private USER_KEY: string = "apiKey";
  private userInLocalStorageSubject: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) {
  }

  public getUserInLocalStorageSubject(): Subject<string> {
    return this.userInLocalStorageSubject;
  }

  public login(email: string, password: string): Observable<any> {
    return this.http.post(environment.API_URL + '/login', {email, password});
  }

  public setUserInLocalStorage(apiKey: string | undefined): void {
    if(apiKey){
      localStorage.setItem(this.USER_KEY, apiKey);
      this.userInLocalStorageSubject.next();
    }
  }

  public removeUserFromLocalStorage(): void {
    localStorage.removeItem(this.USER_KEY);
    this.userInLocalStorageSubject.next();
  }

  public getApiKeyFromLocalStorage(): string {
    return localStorage.getItem(this.USER_KEY) || '';
  }

  public getUserTypeFromApiKey() : string {
    const type = this.getApiKeyFromLocalStorage().split('-');
    return type[0];
  }

  public isAuth(): boolean {
    return localStorage.getItem(this.USER_KEY) != null;
  }

}

