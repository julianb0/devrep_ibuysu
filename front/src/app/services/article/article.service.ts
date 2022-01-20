import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import {ArticleType} from "../../types/article.type";
import {ArticleAuctionType} from "../../types/articleAuction.type";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http : HttpClient) { }

  public addArticle(choice: string, apikey: string, article: ArticleType | ArticleAuctionType): Observable<any> {
    if (choice == "direct") {
      return this.http.post(environment.API_URL + "article-direct/" + apikey, article);
    }
    return this.http.post(environment.API_URL + "article-auction/" + apikey, article);
  }

  public getArticles() : Observable<any> {
    return this.http.get(environment.API_URL + "articles");
  }

  public getUserArticles(userId: number) : Observable<any> {
    return this.http.get(environment.API_URL + "user-articles/" + userId);
  }

  public getArticlesByCategory(category : string) : Observable<any> {
    return this.http.get(environment.API_URL + "articles-by-categories/" + category);
  }

  public getArticlesByKeyword(keyword : string) : Observable<any> {
    return this.http.get(environment.API_URL + "articles-by-keywords/" + keyword);
  }

  public articlePurchaseRequest(articleId: number, sellerId: number, purchaserApikey: string): Observable<any> {
    return this.http.put(environment.API_URL + "article-purchase-request/" + articleId + '/' + sellerId + '/' + purchaserApikey, {});
  }

  public articleOverBid(articleId: number, sellerId: number, purchaserApikey: string, newPrice : number): Observable<any> {
    return this.http.put(environment.API_URL + "article-overbid/" + articleId + '/' + sellerId + '/' + purchaserApikey + '/' + newPrice, {});
  }

  public articleAcceptPurchase(articleId: number, sellerApikey: string): Observable<any> {
    return this.http.put(environment.API_URL + "article-accept-purchase/" + articleId + "/" + sellerApikey, {});
  }

  public articleRefusePurchase(articleId: number, sellerApikey : string): Observable<any> {
    return this.http.put(environment.API_URL + "article-refuse-purchase/" + articleId + "/" + sellerApikey, {});
  }

  public evaluate(articleId: number, evaluatorApiKey: string, note: number): Observable<any>  {
    return this.http.put(environment.API_URL + "article-user-evaluation/" + articleId + '/' + evaluatorApiKey + '/' + note, {});
  }

}
