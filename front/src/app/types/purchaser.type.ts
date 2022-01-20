import {UserType} from "./user.type";
import {ArticleType} from "./article.type";
import {AuctionType} from "./auction.type";

export type PurchaserType = UserType & {
  articles?: ArticleType[],
  auctions?: AuctionType[]
}
