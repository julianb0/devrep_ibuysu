import {UserType} from "./user.type";
import {CreditCardType} from "./creditCard.type";
import {BankCodeType} from "./bankCode.type";
import {ArticleType} from "./article.type";

export type SellerType = UserType & {
  creditCard?: CreditCardType,
  bankCode?: BankCodeType,
  articles?: ArticleType[]
}
