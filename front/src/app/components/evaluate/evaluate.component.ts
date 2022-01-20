import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SecurityService } from 'src/app/services/security/security.service';
import { ArticleType } from 'src/app/types/article.type';
import { ArticleAuctionType } from "../../types/articleAuction.type";
import { Subscription } from "rxjs";
import { ArticleService } from "../../services/article/article.service";

@Component({
  selector: 'app-evaluate',
  templateUrl: './evaluate.component.html',
  styleUrls: ['./evaluate.component.css']
})
export class EvaluateComponent implements OnInit, OnDestroy {

  @Input()
  public article!: ArticleType | ArticleAuctionType;

  @Input()
  public note: number = 0;

  private evaluateSubscription: Subscription | undefined;

  constructor(private articleService: ArticleService, private securityService: SecurityService) {}

  public ngOnInit(): void {
    this.note = (this.securityService.getUserTypeFromApiKey() == "seller") ? this.article.sellerEvaluation : this.article.purchaserEvaluation;
  }

  public evaluate(note: number): void {
    this.evaluateSubscription = this.articleService.evaluate(this.article.id, this.securityService.getApiKeyFromLocalStorage(), note).subscribe(() => {
      this.note = note;
    }, error => console.log(error));
  }

  public ngOnDestroy(): void {
    this.evaluateSubscription?.unsubscribe();
  }

}
