package com.gl.ibuysu.repositories;

import com.gl.ibuysu.models.ArticleAuction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleAuctionRepository extends JpaRepository<ArticleAuction,Long> {
}
