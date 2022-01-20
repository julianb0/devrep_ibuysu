package com.gl.ibuysu.models;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.gl.ibuysu.utils.PurchaseStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "articles")
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String picture;

    private String title;

    private String description;

    private double price;

    private PurchaseStatus purchaseStatus;

    private int sellerEvaluation;

    private int purchaserEvaluation;

    @JsonIgnoreProperties("articles")
    @ManyToMany
    @JoinTable(
            name="article_categories",
            joinColumns=@JoinColumn(name="article_id"),
            inverseJoinColumns = @JoinColumn(name = "article_category_id")
    )
    private List<ArticleCategory> categories = new ArrayList<> ();

    @JsonIgnoreProperties("articles")
    @ManyToMany
    @JoinTable(
            name="article_keywords",
            joinColumns=@JoinColumn(name="article_id "),
            inverseJoinColumns = @JoinColumn(name = "article_keyword_id")
    )
    private List<ArticleKeyword> keywords = new ArrayList<> ();

    @JsonIgnoreProperties("articles")
    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "seller_id", referencedColumnName = "id")
    private Seller seller;

    @JsonIgnoreProperties("articles")
    @ManyToOne
    private Purchaser purchaser;

}
