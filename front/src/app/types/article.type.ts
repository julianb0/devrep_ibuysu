import {ArticleCategoryType} from "./articleCategory.type";
import {ArticleKeyWordType} from "./articleKeyWord.type";
import { PurchaserType } from "./purchaser.type";
import {SellerType} from "./seller.type";

export type ArticleType = {
  id: number,
  picture: string,
  title: string,
  description: string,
  price: number,
  categories: ArticleCategoryType[],
  keywords: ArticleKeyWordType[],
  seller: SellerType,
  purchaser?: PurchaserType,
  purchaseStatus?: "NONE" | "PENDING" | "ACCEPTED" | "REFUSED",
  sellerEvaluation: number,
  purchaserEvaluation: number
  duration: number,
  limitDate: Date,
  addedAt: Date
}
