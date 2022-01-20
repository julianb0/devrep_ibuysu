import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ArticleService} from "../../services/article/article.service";
import {Subscription} from "rxjs";
import {ArticleCategoryType} from "../../types/articleCategory.type";
import {ArticleKeyWordType} from "../../types/articleKeyWord.type";
import {SellerType} from "../../types/seller.type";
import {SecurityService} from "../../services/security/security.service";
import {ArticleType} from "../../types/article.type";

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.css']
})
export class AddArticleComponent implements OnInit, OnDestroy {

  @Input()
  public seller!: SellerType;

  public addArticleForm!: FormGroup;

  public addArticleSubscription!: Subscription;
  public selectDirectOrAuctionSubscription!: Subscription | undefined;

  public choice: string = "direct";
  public selectDirectOption: boolean = true;

  public message!: string;
  public messageError : string = "ERROR something went wrong try again";

  constructor(private formBuilder: FormBuilder, private articleService: ArticleService, private securityService: SecurityService) { }

  public initAddArticleForm(): void {
    this.addArticleForm = this.formBuilder.group({
      selectDirectOrAuction: new FormControl(""),
      picture: new FormControl(""),
      title: new FormControl(""),
      description: new FormControl(""),
      price: new FormControl(""),
      categories: new FormControl(""),
      keywords: new FormControl(""),
      duration: new FormControl("")
    });
  }

  public setChoice(choice: string): void {
    this.choice = choice;
    if (this.choice == "direct") {
      this.initAddArticleForm();
      this.selectDirectOrAuctionSubscription = this.addArticleForm.get("selectDirectOrAuction")?.valueChanges.subscribe(value => {
        this.selectDirectOption = (value == "direct");
        this.choice = value;
      });
    }
  }

  public ngOnInit(): void {
    this.setChoice("direct");
  }

  public onSubmitAddArticleForm(): void {
    if (this.addArticleForm.valid) {
      const categories: ArticleCategoryType[] = [];
      const categoriesArray: string[] = this.addArticleForm.value.categories.trim().split(' ');
      categoriesArray.forEach(c => categories.push({ name: c }));
      const keywords: ArticleKeyWordType[] = [];
      const keywordsArray: string[] = this.addArticleForm.value.keywords.trim().split(' ');
      keywordsArray.forEach(c => keywords.push({ name: c }));

      // @ts-ignore
      const article: ArticleType = {
        picture: this.addArticleForm.value.picture,
        title: this.addArticleForm.value.title,
        description: this.addArticleForm.value.description,
        price: this.addArticleForm.value.price,
        categories,
        keywords,
        seller: this.seller
      };
      article.seller.apikey = this.securityService.getApiKeyFromLocalStorage();

      if (this.choice != "direct" && this.addArticleForm.value.duration > 0) {
        Object.assign(article, {duration: this.addArticleForm.value.duration});
      }

      this.addArticleSubscription = this.articleService.addArticle(this.choice, article.seller.apikey, article).subscribe(response => {
        this.addArticleForm.reset();
        location.reload();
      }, error => this.message = this.messageError);
    } else {
      this.message = this.messageError;
    }
  }

  public ngOnDestroy(): void {
    this.addArticleSubscription?.unsubscribe();
    this.selectDirectOrAuctionSubscription?.unsubscribe();
  }

}

