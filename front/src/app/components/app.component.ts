import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {SecurityService} from "../services/security/security.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  title = "ibuysu";

  modalIsOpen = false;
  modalContent = "";

  isAuth = false;
  isAuthSubscription!: Subscription;

  constructor(private securityService: SecurityService, private router: Router) {
  }

  public ngOnInit(): void {
    this.isAuth = this.securityService.isAuth();
    this.isAuthSubscription = this.securityService.getUserInLocalStorageSubject().subscribe(() => {
      this.isAuth = this.securityService.isAuth();
    });
  }

  public openModal(modalContent: string): void {
    this.modalContent = modalContent;
    this.modalIsOpen = true;
  }

  public closeModal(): void {
    this.modalIsOpen = false;
  }

  public logOut(): void{
    this.securityService.removeUserFromLocalStorage();
    this.router.navigateByUrl('/');
  }

  ngOnDestroy(): void {
    this.isAuthSubscription?.unsubscribe();
  }

}
