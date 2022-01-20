import {ArticleAuctionType} from "./articleAuction.type";
import {PurchaserType} from "./purchaser.type";

export type AuctionType = {
  id?: number,
  articleAuction: ArticleAuctionType,
  purchaser: PurchaserType
}
