package com.gl.ibuysu.repositories;

import com.gl.ibuysu.models.ArticleCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleCategoryRepository extends JpaRepository<ArticleCategory,Long> {
}
