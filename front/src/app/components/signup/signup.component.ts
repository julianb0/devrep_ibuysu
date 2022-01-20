import {Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from "../../services/user/user.service";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from "rxjs";
import { SellerType } from "../../types/seller.type";
import {PurchaserType} from "../../types/purchaser.type";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  public registerSellerForm!: FormGroup;
  public registerPurchaserForm!: FormGroup;

  public choice: string = "seller";
  public creditCardIsSelected = true;

  public registerSubscription!: Subscription;
  public selectCreditCardOrBankCodeSubscription: Subscription | undefined;

  public message!: string;
  public messageSuccess : string = "Congrats, You've successfully signed up to ibuysu !";
  public messageError : string = "ERROR something went wrong try again.";


  constructor(private formBuilder: FormBuilder, private userService: UserService) { }

  public initRegisterSellerForm(): void {
    this.registerSellerForm = this.formBuilder.group({
      firstname: new FormControl(''),
      lastname: new FormControl(''),
      country: new FormControl(''),
      address: new FormControl(''),
      city: new FormControl(''),
      postalCode: new FormControl(''),
      phone: new FormControl(''),
      selectCreditCardOrBankCode: new FormControl(''),
      number: new FormControl(''),
      expiryDate: new FormControl(''),
      securityCode: new FormControl(''),
      bic: new FormControl(''),
      iban: new FormControl(''),
      email: new FormControl('', [Validators.email]),
      password: new FormControl('')
    });
  }

  public initRegisterPurchaserForm(): void {
    this.registerPurchaserForm = this.formBuilder.group({
      firstname: new FormControl(''),
      lastname: new FormControl(''),
      country: new FormControl(''),
      address: new FormControl(''),
      city: new FormControl(''),
      postalCode: new FormControl(''),
      phone: new FormControl(''),
      email: new FormControl('', [Validators.email]),
      password: new FormControl('')
    });
  }

  public setChoice(choice: string): void {
    this.choice = choice;
    if (this.choice == "seller") {
      this.initRegisterSellerForm();
      this.selectCreditCardOrBankCodeSubscription = this.registerSellerForm.get("selectCreditCardOrBankCode")?.valueChanges.subscribe(value => {
        this.creditCardIsSelected = (value == "creditCard");
      });
    } else {
      this.initRegisterPurchaserForm();
    }
  }

  public ngOnInit(): void {
    this.setChoice("seller");
  }

  public onSubmitRegisterSellerForm(): void {
    if (this.registerSellerForm.valid) {
      const sellerFormValue = this.registerSellerForm.value;

      // @ts-ignore
      const seller: SellerType = {
        firstname: sellerFormValue.firstname,
        lastname: sellerFormValue.lastname,
        address: {
          country: sellerFormValue.country,
          address: sellerFormValue.address,
          city: sellerFormValue.city,
          postalCode: sellerFormValue.postalCode
        },
        creditCard: {
          number: sellerFormValue.number,
          expiryDate: sellerFormValue.expiryDate,
          securityCode: sellerFormValue.securityCode
        },
        bankCode: {
          bic: sellerFormValue.bic,
          iban: sellerFormValue.iban,
        },
        phone: sellerFormValue.phone,
        email: sellerFormValue.email,
        password: sellerFormValue.password
      };

        this.registerSubscription = this.userService.addSeller(seller).subscribe(response => {
            this.message = this.messageSuccess;
            this.registerSellerForm.reset();
          }, error => {
            this.message = this.messageError;
        });
      } else {
        this.message = this.messageError;
      }
  }

  public onSubmitRegisterPurchaserForm(): void {
    if (this.registerPurchaserForm.valid){
      const purchaserFormValue = this.registerPurchaserForm.value;

      // @ts-ignore
      const purchaser : PurchaserType = {
        firstname: purchaserFormValue.firstname,
        lastname: purchaserFormValue.lastname,
        address: {
          country: purchaserFormValue.country,
          address: purchaserFormValue.address,
          city: purchaserFormValue.city,
          postalCode: purchaserFormValue.postalCode
        },
        phone: purchaserFormValue.phone,
        email: purchaserFormValue.email,
        password: purchaserFormValue.password
      }

      if (this.registerPurchaserForm.valid) {
        this.registerSubscription = this.userService.addPurchaser(purchaser).subscribe(response => {
          this.message = this.messageSuccess;
          this.registerPurchaserForm.reset();
        }, error => {
          this.message = this.messageError;
        });
      } else {
        this.message = this.messageError;
      }
    }
  }

  public ngOnDestroy() {
    this.registerSubscription?.unsubscribe();
    this.selectCreditCardOrBankCodeSubscription?.unsubscribe();
  }

}
