import { Observable} from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { PurchaserType } from "../../types/purchaser.type";
import { SellerType } from "../../types/seller.type";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiServerUrl = environment.API_URL;

  constructor(private http: HttpClient) { }

  public addSeller(seller : SellerType): Observable<SellerType> {
    return this.http.post<SellerType>(`${this.apiServerUrl}seller`, seller);
  }

  public addPurchaser(purchaser : PurchaserType): Observable<PurchaserType> {
    return this.http.post<PurchaserType>(`${this.apiServerUrl}purchaser`, purchaser);
  }

  public getUserByApiKey(apiKey: string): Observable<any>  {
    return this.http.get(`${this.apiServerUrl}user/${apiKey}`);
  }

  public getUserById(id: number): Observable<any>  {
    return this.http.get(`${this.apiServerUrl}user-by-id/${id}`);
  }

}
