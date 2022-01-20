import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {SecurityService} from "../../services/security/security.service";
import {FormControl, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  @Output() loginModalStateEmitter = new EventEmitter<boolean>();

  public loginForm!: FormGroup;
  public loginSubscription!: Subscription;

  public message!: string;
  public messageError : string = "ERROR something went wrong try again.";

  constructor(private securityService : SecurityService, private router: Router) { }

  public initLoginForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    });
  }

  public ngOnInit(): void {
    this.initLoginForm();
  }

  public onSubmitLoginForm(): void {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    if (email && password) {
      this.loginSubscription = this.securityService.login(email, password).subscribe(response => {
        this.securityService.setUserInLocalStorage(response.apiKey);
        this.loginForm.reset();
        this.loginModalStateEmitter.emit();
        this.router.navigateByUrl("/profile");
      }, error => {
        this.message = this.messageError;
      });
    } else {
      this.message = this.messageError;
    }
  }

  public ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
  }

}
