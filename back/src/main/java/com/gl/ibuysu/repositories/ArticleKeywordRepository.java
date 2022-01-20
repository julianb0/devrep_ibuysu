package com.gl.ibuysu.repositories;

import com.gl.ibuysu.models.ArticleKeyword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleKeywordRepository extends JpaRepository<ArticleKeyword,Long> {
}
