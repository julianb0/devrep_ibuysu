import { Component, OnDestroy, OnInit } from '@angular/core';
import {UserService} from "../../services/user/user.service";
import {SecurityService} from "../../services/security/security.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import { SellerType } from 'src/app/types/seller.type';
import { PurchaserType } from 'src/app/types/purchaser.type';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  isAuth!: boolean
  authUser!: SellerType | PurchaserType;
  userType!: string;

  currentUserProfile!: SellerType | PurchaserType;

  userSubscription!: Subscription;

  profileModal!: boolean;
  profileModalContent!: string;

  constructor(private securityService: SecurityService, private router: Router, private activatedRoute: ActivatedRoute, private userService: UserService) { }

  public ngOnInit(): void {
    this.isAuth = this.securityService.isAuth();

    const id = this.activatedRoute.snapshot.params['id'];
    if(id && parseInt(id, 10) > 0){
      this.userSubscription = this.userService.getUserById(id).subscribe(response => {
        this.currentUserProfile = response;
      }, error => {
        this.router.navigateByUrl('/');
      });
    } else {
      this.userSubscription = this.userService.getUserByApiKey(this.securityService.getApiKeyFromLocalStorage()).subscribe(response => {
        this.authUser = response;
        this.userType = this.securityService.getUserTypeFromApiKey();
        this.currentUserProfile = this.authUser;
      }, error => {
        this.securityService.removeUserFromLocalStorage();
        this.router.navigateByUrl('/');
      });
    }
  }

  public openProfileModal(profileModalContent: string): void {
    this.profileModalContent = profileModalContent;
    this.profileModal = true;
  }

  public closeProfileModal(): void {
    this.profileModal = false;
  }

  public ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

}
