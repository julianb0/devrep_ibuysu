import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ArticleService } from '../../services/article/article.service';
import { ArticleType } from '../../types/article.type';
import { Subscription } from "rxjs";
import { SecurityService } from "../../services/security/security.service";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { SellerType } from "../../types/seller.type";
import { PurchaserType } from "../../types/purchaser.type";
import { ArticleAuctionType } from "../../types/articleAuction.type";
import { UserService } from "../../services/user/user.service";

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit, OnDestroy {

  @Input() public isCalledByProfileComponent:boolean = false;
  @Input() public withSearch: boolean = true;
  @Input() public currentUser!: SellerType | PurchaserType;
  public newPrice!: number;
  public display: string = "all";
  public search: string = "categories";
  public searchForm!: FormGroup;
  public searchFormSubscription!: Subscription;

  public isAuth!: boolean;
  public userType!: string;

  public articles: ArticleType[] | ArticleAuctionType[] | undefined;
  public filteredArticles: ArticleType[] | ArticleAuctionType[] | undefined;
  public filteredCurrentProfileArticles: ArticleType[] | ArticleAuctionType[] | undefined;

  public purchaseStatus: string = '';

  private authUserSubscription!: Subscription;
  private articlesSubscription!: Subscription;
  private purchaseSubscription!: Subscription;
  private overbidSubscription!: Subscription;

  // TODO use it
  public loading: boolean = false;

  constructor(private formBuilder: FormBuilder, private securityService: SecurityService, private userService: UserService, private articleService: ArticleService) { }

  public initRegisterSellerForm(): void {
    this.searchForm = this.formBuilder.group({
      name: new FormControl('')
    });
  }

  public ngOnInit(): void {
    this.initRegisterSellerForm();

    this.isAuth = this.securityService.isAuth();
    this.userType = this.securityService.getUserTypeFromApiKey();

    if (this.isAuth) {
      this.authUserSubscription = this.userService.getUserByApiKey(this.securityService.getApiKeyFromLocalStorage()).subscribe(response => {
        this.currentUser = response;
      }, error => console.log(error));
    }

    const req = (this.isCalledByProfileComponent && this.isAuth && this.userType == 'seller') ? this.articleService.getUserArticles(this.currentUser.id) : this.articleService.getArticles();
    this.articlesSubscription = req.subscribe(response => {
      let articles : ArticleType[] | ArticleAuctionType[] = response.filter((article: any)=> article.purchaseStatus == "REFUSED" || article.purchaseStatus == "NONE");

      if (this.isAuth && this.userType == 'seller') {
        articles = response.filter((article: any) => {
          return (article?.seller?.id == this.currentUser?.id)
            ||
            ((article.seller?.id != this.currentUser?.id) &&  article.purchaseStatus == "REFUSED" || article.purchaseStatus == "NONE")
        });
      }

      if (this.isAuth && this.userType == 'purchaser') {
        articles = response.filter((article: any) => {
          return article.purchaseStatus == "NONE"
            ||
            (article?.purchaser?.id != this.currentUser?.id) && article.purchaseStatus == "REFUSED" || article.purchaseStatus == "NONE"
            ||
            (article?.purchaser?.id == this.currentUser?.id)
        });
      }

      this.articles = articles;
      this.filteredArticles = articles;
    }, error => console.log(error));
  }

  public onSubmitSearchForm(): void {
    if (this.searchForm.valid){
      const value = this.searchForm.value.name.trim();
      if (value == '') {
        this.searchFormSubscription = this.articleService.getArticles().subscribe(response => {
            this.articles = response;
            this.filteredArticles = response;
            this.filteredCurrentProfileArticles = response;
          },
          error =>  console.log(error));
      } else if (this.search == "categories") {
        console.log("Cat : " + value);
        this.searchFormSubscription = this.articleService.getArticlesByCategory(value).subscribe(response => {
          this.articles = response;
          this.filteredArticles = response;
          this.filteredCurrentProfileArticles = response;
          console.log(response);
        }, error => console.log(error));
      } else {
        this.searchFormSubscription = this.articleService.getArticlesByKeyword(value).subscribe(response => {
          this.articles = response;
          this.filteredArticles = response;
          this.filteredCurrentProfileArticles = response;
        }, error => console.log(error));
      }
    }
  }

  public displayAllArticles(): void {
    this.filteredArticles = this.articles;
    this.display = "all";
  }

  public displayDirectArticles(): void {
    this.filteredArticles = this.articles?.filter((article: any) => !(article.duration));
    this.display = "direct";
  }

  public displayAuctionsArticles(): void {
    this.filteredArticles = this.articles?.filter((article: any) => article.duration && article.duration > 0);
    this.display = "auctions";
  }

  public purchaseRequest(article: ArticleType | ArticleAuctionType): void {
    this.purchaseSubscription = this.articleService.articlePurchaseRequest(article.id, article.seller.id, this.securityService.getApiKeyFromLocalStorage()).subscribe(() => {
      this.ngOnInit();
    }, () => location.reload());
  }

  public acceptPurchase(article: ArticleType): void {
    this.purchaseSubscription = this.articleService.articleAcceptPurchase(article.id, this.securityService.getApiKeyFromLocalStorage()).subscribe(() => {
      this.ngOnInit();
    }, error => console.log(error));
  }

  public refusePurchase(article: ArticleType): void {
    this.purchaseSubscription = this.articleService.articleRefusePurchase(article.id, this.securityService.getApiKeyFromLocalStorage()).subscribe(() => {
      this.ngOnInit();
    }, error => console.log(error));
  }

  public overbid(article : ArticleAuctionType) : void {
    if (this.newPrice > article.price) {
      this.overbidSubscription = this.articleService.articleOverBid(article.id, article.seller.id, this.securityService.getApiKeyFromLocalStorage(), this.newPrice).subscribe(() => {
        this.ngOnInit();
      }, error => console.log(error));
    }
  }

  public inputPrice(event : number, price : number) : void{
    this.newPrice = event > price ? event : price;
  }

  public formatDate(date: Date) {
    return new Date(date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'numeric', day: 'numeric', hour: "2-digit", minute: "2-digit" })
  }

  public auctionIsFinish(limitDate: Date) : boolean {
    console.log(this.formatDate(new Date()) >= this.formatDate(limitDate));
    return this.formatDate(new Date()) >= this.formatDate(limitDate) ;
  }

  public ngOnDestroy(): void {
    this.authUserSubscription?.unsubscribe();
    this.searchFormSubscription?.unsubscribe();
    this.articlesSubscription?.unsubscribe();
    this.purchaseSubscription?.unsubscribe();
  }

}
