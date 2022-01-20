package com.gl.ibuysu.repositories;

import com.gl.ibuysu.models.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleRepository extends JpaRepository<Article,Long> {
    @Query(value = "SELECT a FROM Article a JOIN a.categories c ON c.name=:category")
    Iterable<Article> findByCategory(String category);

    @Query(value = "SELECT a FROM Article a JOIN a.keywords k ON k.name=:keyword")
    Iterable<Article> findByKeyword(String keyword);

    @Query(value = "SELECT a FROM Article a WHERE a.purchaser is null")
    Iterable<Article> findNotPurchasedArticles();

    @Query(value = "SELECT a FROM Article a WHERE a.seller.id=:userId")
    Iterable<Article> findByUser(Long userId);

}
