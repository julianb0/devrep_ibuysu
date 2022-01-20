package com.gl.ibuysu.controllers;

import java.util.*;
import com.gl.ibuysu.models.*;
import com.gl.ibuysu.models.Article;
import com.gl.ibuysu.models.ArticleAuction;
import com.gl.ibuysu.repositories.ArticleAuctionRepository;
import com.gl.ibuysu.repositories.ArticleCategoryRepository;
import com.gl.ibuysu.repositories.ArticleKeywordRepository;
import com.gl.ibuysu.repositories.ArticleRepository;
import com.gl.ibuysu.repositories.UserRepository;
import com.gl.ibuysu.utils.PurchaseStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class ArticleController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private ArticleCategoryRepository articleCategoryRepository;

    @Autowired
    private ArticleKeywordRepository articleKeywordRepository;

    @Autowired
    private ArticleAuctionRepository articleAuctionRepository;

    @PostMapping("/article-direct/{sellerApikey}")
    public Article addArticleDirect(@PathVariable("sellerApikey") final String sellerApikey, @RequestBody Article article) {
        Optional<User> seller = userRepository.findByApiKey(sellerApikey);
        if (seller.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        List<ArticleCategory> categories = article.getCategories();
        if (categories != null) {
            articleCategoryRepository.saveAll(categories);
        }
        List<ArticleKeyword> keywords = article.getKeywords();
        if (keywords != null) {
            articleKeywordRepository.saveAll(keywords);
        }
        article.setPurchaseStatus(PurchaseStatus.NONE);
        return articleRepository.save(article);
    }

    @PostMapping("/article-auction/{sellerApikey}")
    public ArticleAuction addArticleAuction(@PathVariable("sellerApikey") final String sellerApikey, @RequestBody ArticleAuction articleAuction) {
        Optional<User> seller = userRepository.findByApiKey(sellerApikey);
        List<Integer> durations = new ArrayList<>();
        durations.add(3);
        durations.add(5);
        durations.add(7);
        durations.add(10);
        if (seller.isEmpty() || !durations.contains(articleAuction.getDuration())){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        List<ArticleCategory> categories = articleAuction.getCategories();
        if (categories != null) {
            articleCategoryRepository.saveAll(categories);
        }
        List<ArticleKeyword> keywords = articleAuction.getKeywords();
        if (keywords != null) {
            articleKeywordRepository.saveAll(keywords);
        }
        Date nowDate = new Date(System.currentTimeMillis());
        Date limitDate = new Date(System.currentTimeMillis() + (long) articleAuction.getDuration() *24*3600*1000);
        articleAuction.setAddedAt(nowDate);
        articleAuction.setLimitDate(limitDate);
        articleAuction.setPurchaseStatus(PurchaseStatus.NONE);
        return articleAuctionRepository.save(articleAuction);
    }

    @GetMapping("/articles")
    public Iterable<Article> getArticles() {
        return this.articleRepository.findAll();
    }

    @GetMapping("/user-articles/{userId}")
    public Iterable<Article> getUserArticles(@PathVariable("userId") final Long userId) {
        return this.articleRepository.findByUser(userId);
    }

    @GetMapping("/not-purchased-articles")
    public Iterable<Article> getNotPurchasedArticles() {
        return this.articleRepository.findNotPurchasedArticles();
    }

    @GetMapping("/articles-by-categories/{category}")
    public Iterable<Article> getArticlesByCategory(@PathVariable("category") final String category) {
        return this.articleRepository.findByCategory(category);
    }

    @GetMapping("/articles-by-keywords/{keyword}")
    public Iterable<Article> getArticlesByKeyword(@PathVariable("keyword") final String keyword) {
        return this.articleRepository.findByKeyword(keyword);
    }

    @PutMapping("/article-purchase-request/{articleId}/{sellerId}/{purchaserApikey}")
    public Article purchaseRequest(@PathVariable("articleId") final Long articleId, @PathVariable("sellerId") final Long sellerId, @PathVariable("purchaserApikey") final String purchaserApikey) {
        Optional<Article> articleExist = this.articleRepository.findById(articleId);
        if (articleExist.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        Article article = articleExist.get();
        Optional<User> seller = this.userRepository.findById(sellerId);
        Optional<User> purchaser = this.userRepository.findByApiKey(purchaserApikey);
        if (article.getPurchaseStatus() == PurchaseStatus.PENDING || article.getPurchaseStatus() == PurchaseStatus.ACCEPTED || seller.isEmpty() || purchaser.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        article.setSeller((Seller) seller.get());
        article.setPurchaser((Purchaser) purchaser.get());
        article.setPurchaseStatus(PurchaseStatus.PENDING);
        return this.articleRepository.save(article);
    }

    @PutMapping("/article-accept-purchase/{articleId}/{sellerApikey}")
    public Article acceptPurchase(@PathVariable final Long articleId, @PathVariable("sellerApikey") final String sellerApikey) {
        Optional<Article> articleExist = this.articleRepository.findById(articleId);
        Optional<User> seller = this.userRepository.findByApiKey(sellerApikey);
        if (articleExist.isEmpty() || seller.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        Article article = articleExist.get();
        article.setPurchaseStatus(PurchaseStatus.ACCEPTED);
        return this.articleRepository.save(article);
    }

    @PutMapping("/article-refuse-purchase/{articleId}/{sellerApikey}")
    public Article refusePurchase(@PathVariable final Long articleId, @PathVariable("sellerApikey") final String sellerApikey) {
        Optional<Article> articleExist = this.articleRepository.findById(articleId);
        Optional<User> seller = this.userRepository.findByApiKey(sellerApikey);
        if (articleExist.isEmpty() || seller.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        Article article = articleExist.get();
        article.setPurchaseStatus(PurchaseStatus.REFUSED);
        return this.articleRepository.save(article);
    }

    @PutMapping("/article-overbid/{articleId}/{sellerId}/{purchaserApikey}/{price}")
    public ArticleAuction auction(@PathVariable final Long articleId, @PathVariable("sellerId") final Long sellerId, @PathVariable("purchaserApikey") final String purchaserApikey, @PathVariable("price") final double price) {
        Optional<ArticleAuction> articleExist = this.articleAuctionRepository.findById(articleId);
        Optional<User> purchaser = this.userRepository.findByApiKey(purchaserApikey);
        Optional<User> seller = this.userRepository.findById(sellerId);
        if (articleExist.isEmpty() || purchaser.isEmpty() || seller.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        ArticleAuction article = articleExist.get();
        if (price <= article.getPrice()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        article.setSeller((Seller) seller.get());
        article.setPrice(price);
        article.setPurchaser((Purchaser)purchaser.get());
        return this.articleAuctionRepository.save(article);
    }

    @PutMapping("/article-user-evaluation/{articleId}/{evaluatorApiKey}/{note}")
    private Article articleUserEvaluation(@PathVariable("articleId") final long articleId, @PathVariable("evaluatorApiKey") final String evaluatorApiKey, @PathVariable("note") final int note) {
        Optional<Article> articleExist = this.articleRepository.findById(articleId);
        Optional<User> evaluatorUserExist = this.userRepository.findByApiKey(evaluatorApiKey);
        if (articleExist.isEmpty() || evaluatorUserExist.isEmpty() || (note < 1 || note > 5)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        Article article = articleExist.get();
        User evaluatorUser = evaluatorUserExist.get();
        if (article.getPurchaseStatus() != PurchaseStatus.ACCEPTED) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        if (article.getSeller().getId().equals(evaluatorUser.getId())){
            article.setSellerEvaluation(note);
        } else if (article.getPurchaser().getId().equals(evaluatorUser.getId())){
            article.setPurchaserEvaluation(note);
        }
        return this.articleRepository.save(article);
    }

}
